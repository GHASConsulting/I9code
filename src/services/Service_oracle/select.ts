import { connectionTasy } from "../../connection/database";

// Função auxiliar para garantir que a conexão seja fechada
async function withConnection(callback: (connection: any) => Promise<any>) {
  const connection = await connectionTasy();
  try {
    return await callback(connection);
  } catch (err) {
    console.error('Erro durante a operação:', err);
    throw err;  // Relança o erro após logá-lo
  } finally {
    await connection.close();
  }
}

// Função para obter evolução
export async function obterEvolucao(): Promise<any[]> {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `
      SELECT 
      ds_evolucao_sem_formatacao,
      nr_atendimento, 
      dt_evolucao 
      FROM TASY.evolucao_paciente_i9code_teste
      `
    );
    return result.rows;
  });
}

async function countEvolucao(): Promise<any[]> {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `
      SELECT
      COUNT(*) as total
      FROM
      TASY.evolucao_paciente_i9code_teste
      `
    );
    return result.rows;
  });
}

export async function obterEvolucaoPorId(id: number): Promise<any[]> {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `
      SELECT
      ds_evolucao_sem_formatacao,
      nr_atendimento,
      dt_evolucao
      FROM
      TASY.evolucao_paciente_i9code
      WHERE
      nr_atendimento = :id
      AND TRUNC(dt_evolucao) <= TRUNC(SYSDATE)
      ORDER BY
      dt_evolucao
      `,
      [id]
    );
    return result.rows;
  });
}

// Função para verificar se o CID e o atendimento existem
export async function verificarCID(cid: string, nr_atendimento: number): Promise<any> {
  return withConnection(async (connection) => {
    const result = await connection.execute(
      `
      SELECT 
      *
      FROM
      tbl_inm_cid_secundario
      WHERE
      cd_cid = :cid
      AND 
      nr_atendimento = :nr_atendimento
      `,
      [cid, nr_atendimento]
    );
    return result.rows[0];
  });
}

// Função para inserir CIDs no banco com verificações aprimoradas
export async function inserirCids(cidsString: string, nr_atendimento: number, dt_evolucao: Date): Promise<void> {
  function separarTexto(texto: string) {
    const partes = texto.split(" - ");
    if (partes.length >= 3) {
      const [cid, descricao, justificativa] = partes;
      return {
        cid: cid.trim(),
        descricao: descricao.trim(),
        justificativa: justificativa.trim(),
      };
    } else {
      return null;
    }
  }

  const cidsList = cidsString
    .split("\n")
    .filter((line) => line.trim() !== '')
    .map(separarTexto)
    .filter((item) => item !== null);

  const insertQuery = `
    BEGIN
      codificacao_inovemed(
      :cd_cid_p, 
      :nr_atendimento_p, 
      :dt_evolucao_p, 
      :ds_cid_p, 
      :ds_justificativa
      );
      END;
  `;
  await withConnection(async (connection) => {
    const result = await connection.query(insertQuery, {
      cd_cid_p: cidsList.map((item) => item.cid),
      nr_atendimento_p: nr_atendimento,
      dt_evolucao_p: dt_evolucao,
      ds_cid_p: cidsList.map((item) => item.descricao),
      ds_justificativa: cidsList.map((item) => item.justificativa),
    });
    });

  }
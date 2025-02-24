import { connectionTasy } from "../../connection/database";
import { verificarCID } from "./select";

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
      :ds_justificativa_p
      );
      END;
  `;
  
  return withConnection(async (connection) => {
    try {
      for (const { cid, descricao, justificativa } of cidsList) {

        const checkinCid = await verificarCID(cid, nr_atendimento)

        if (cid.length < 7) {
          if (checkinCid === undefined || null) {
            const binds = {
              cd_cid_p: cid,
              nr_atendimento_p: nr_atendimento,
              dt_evolucao_p: dt_evolucao,
              ds_cid_p: descricao,
              ds_justificativa_p: justificativa,
            };
            console.log(binds);

            await connection.execute(insertQuery, binds);
            await connection.commit();
            console.log('CIDs inseridos com sucesso!');
          } else {
            console.log("cid exists =>", cid)
          }
        } else {
          console.log("cid invalido =>", cid)
          return
        }

      }
    } catch (err) {
      console.error('Erro ao inserir CIDs:', err);
      throw err;  // Relança o erro após logá-lo
    }

  });
}
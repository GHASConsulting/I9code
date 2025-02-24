import oracledb from 'oracledb';
import path from 'path';
import fs from 'fs';
import "dotenv/config"

const instantClientPath = path.resolve(process.env.ORACLE_LIBARY);

// Verifique se o diretório existe
fs.access(instantClientPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`Diretório não encontrado: ${instantClientPath}`);
  } else {
    return
  }
});

oracledb.initOracleClient({ libDir: instantClientPath});

export async function connectionTasy() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.BASE_USER,
      password: process.env.BASE_PASSWORD,
      connectString: process.env.DATABASE_URL
    });
    return connection;
  } catch (error : any) {
    console.error('Erro na conexão com o banco de dados:', error.message);
    throw error
  }
}

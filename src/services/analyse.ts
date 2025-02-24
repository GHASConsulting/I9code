import { analiseCid } from "../controller/register";
import { inserirCids } from "./Service_oracle/insert";
import { obterEvolucao } from "./Service_oracle/select";

// Função para limpar espaços extras e quebras de linha
function cleanArrayText(data: string[][]) {
  return data.map(obj =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => 
        [key, typeof value === "string" ? value.replace(/\s+/g, ' ').trim() : value]
      )
    )
  );
}

export async function analiseAnaminese() {
  let anamineseArray = await obterEvolucao();

  // Limpeza de espaços extras e quebras de linha
  anamineseArray = cleanArrayText(anamineseArray);

  anamineseArray.map(async function(index) {
    const data = `Evolução: ${index[0]}`;
    // const res = await callChatGPT(data);
    const res = await analiseCid(data)


    await inserirCids(res, index[1], index[2]);

    return res;
  });

  return;
}
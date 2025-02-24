import { writeFile, readFile } from 'fs/promises';

export class TokenManager {
  private token: string;
  private tokenInterval: number = 50 * 60 * 1000; // 50 minutos em milissegundos
  private tokenFilePath: string = 'token.txt';

  constructor() {
    this.token = this.generateToken();
    this.saveToken();
    this.startTokenInterval();
  }

  private generateToken(): string {
    // Função para gerar um token (pode ser customizada)
    return Math.random().toString(36).substr(2);
  }

  private async saveToken(): Promise<void> {
    // Salvar o token em um arquivo
    await writeFile(this.tokenFilePath, this.token, 'utf8');
  }

  private async loadToken(): Promise<void> {
    try {
      // Carregar o token do arquivo
      const token = await readFile(this.tokenFilePath, 'utf8');
      this.token = token;
    } catch (error) {
      // Se não conseguir carregar o token, gerar um novo
      this.token = this.generateToken();
      await this.saveToken();
    }
  }

  private startTokenInterval(): void {
    // Configurar o intervalo para gerar um novo token a cada 50 minutos
    setInterval(async () => {
      this.token = this.generateToken();
      await this.saveToken();
    }, this.tokenInterval);
  }

  public async getToken(): Promise<string> {
    await this.loadToken();
    return this.token;
  }
}
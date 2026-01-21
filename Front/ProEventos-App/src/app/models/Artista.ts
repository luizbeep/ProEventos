import { RedeSocial } from "./RedeSocial";

export interface Artista {
  id: number;
  nome: string;
  descricao: string;
  imagemURL: string;
  redesSociais: RedeSocial[];
  artistasEvento: Artista[];
}

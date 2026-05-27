import { EstoqueProvider } from "./EstoqueContext";
import FormProduto from "../componentes/FormProduto";
import TabelaProdutos from "../componentes/TabelaProdutos";

export default function App(){
  return(
    <EstoqueProvider>
      <h1>Controle de Estoque</h1>
      <FormProduto />
      <TabelaProdutos />
    </EstoqueProvider>
  )
}
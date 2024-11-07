'use client';

import Pagina from "@/app/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card, Container } from "react-bootstrap";
import { FaCheck, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2"; 

export default function PedidosClientes() {
  const [listaCompras, setListaCompras] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [nomeCliente, setNomeCliente] = useState(""); 
  const [dataPedido, setDataPedido] = useState(""); 
  const [statusPedido, setStatusPedido] = useState(""); 
  const [imagemProduto, setImagemProduto] = useState([]);
  const route = useRouter();

  useEffect(() => {
    const cliente = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!cliente) {
          Swal.fire({
            title: "Atenção",
            text: "Para realizar pedidos os usuários precisam estar logados. Por favor, realize o login.",
            icon: "warning",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            route.push("/login");
          });
          return;
        }
    
    setNomeCliente(cliente.nome); 

    const compras = JSON.parse(localStorage.getItem("listaCompras")) || [];
    setListaCompras(compras);
    calcularValorTotal(compras);

    const pedido = JSON.parse(localStorage.getItem("pedidoAtual"));
    if (pedido) {
      setDataPedido(new Date(pedido.dataPedido).toLocaleDateString());
      setStatusPedido(pedido.status);
      setImagemProduto(pedido.imagemProduto || []); 
    }
  }, []); 

  const calcularValorTotal = (produtos) => {
    const total = produtos.reduce((acc, produto) => acc + produto.valorUnitario * produto.quantidade, 0);
    setValorTotal(parseFloat(total).toFixed(2));
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    // Atualiza a lista de compras mapeando cada produto
    const novosProdutos = listaCompras.map((produto) => {
      // Verifica se o produto atual tem o mesmo ID do produto a ser atualizado
      if (produto.id === produtoId) {
        // Se sim, cria um novo objeto para esse produto, mantendo as outras propriedades e atualizando a quantidade
        return { ...produto, quantidade: novaQuantidade };
      }
      // Se o ID do produto não for o mesmo, retorna o produto original sem alterações
      return produto;
    })
    // Filtra os produtos para remover aqueles com quantidade igual ou menor que zero
    .filter(produto => produto.quantidade > 0); 

    // Atualiza o estado com a nova lista de produtos
    setListaCompras(novosProdutos);

    // Salva a nova lista de compras no localStorage para persistência
    localStorage.setItem("listaCompras", JSON.stringify(novosProdutos));

    // Recalcula o valor total com a lista de produtos atualizada
    calcularValorTotal(novosProdutos);
};

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Converte a lista de arquivos do input em um array
    const imagensValidas = []; // Array para armazenar as imagens que são válidas para upload

    files.forEach(file => { 
      const fileType = file.type; // Verifica o tipo de cada arquivo

      // Verifica se o tipo do arquivo é PNG ou PDF
      if (fileType === 'image/png' || fileType === 'application/pdf') {
        const reader = new FileReader(); // Cria um FileReader para ler o conteúdo do arquivo
        reader.onloadend = () => {
          imagensValidas.push(reader.result); // Armazena a imagem como base64 no array de imagens válidas

          // Quando todas as imagens foram lidas, atualiza o estado com as novas imagens
          if (imagensValidas.length === files.length) {
            setImagemProduto(prev => [...prev, ...imagensValidas]); // Adiciona as novas imagens ao estado, preservando as imagens anteriores
          }
        };
        reader.readAsDataURL(file); // Lê o arquivo como uma URL base64, para facilitar a exibição
      } else {
        // Se o arquivo não for PNG ou PDF, exibe um alerta usando SweetAlert
        Swal.fire({
          title: 'Formato de arquivo inválido!',
          text: 'Por favor, envie apenas arquivos PNG ou PDF.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary', 
          },
        });
      }
    });
  };


  const finalizarPedido = () => {
    const cliente = JSON.parse(localStorage.getItem("usuarioLogado"));
    
    if (!cliente) {
      alert("Você precisa estar logado para finalizar o pedido.");
      route.push("/login");
      return;
    }
  
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []; 
    const novoPedido = {
      id: Date.now(),
      produtos: listaCompras.map(produto => ({
        ...produto,
        quantidade: produto.quantidade, 
      })),
      valorTotal,
      dataPedido: new Date().toISOString(),
      previsaoEntrega: new Date().setDate(new Date().getDate() + 10), 
      nomeCliente,
      status: "Aguardando Pagamento",
      imagemProduto 
    };
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    localStorage.removeItem("listaCompras");
    route.push("/pagamentos");
  };
  
  return (
    <Pagina titulo={`Pedidos${nomeCliente ? ` de ${nomeCliente}` : ''}`}>
      <Container>
        {listaCompras.length === 0 ? (
          <div className="text-center"> 
            <h5>Carrinho Vazio</h5>
            <p>Nenhum item no carrinho. Adicione produtos para finalizar o pedido.</p>
            <p>Para realizar pedidos o Usuário deve estar Logado!</p>
            <Link href="/produtos" passHref className="btn btn-primary mx-2">
              <FaShoppingCart /> Comprar Produtos
            </Link>
          </div>
        ) : (
          <>
            <Row>
              <Col xs={12}>
                <h5>Data do Pedido: {dataPedido}</h5>
                <h6>Status: {statusPedido}</h6> 
              </Col>
            </Row>

            <Row>
              {listaCompras.map((produto) => (
                <Col xs={12} md={4} key={produto.id} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>{produto.nome}</Card.Title>
                      <Card.Text>
                        Preço Unitário: R${produto.valorUnitario} <br />
                        Subtotal: R${(produto.valorUnitario * produto.quantidade).toFixed(2)}
                      </Card.Text>
                      <Form.Group controlId={`quantidade-${produto.id}`}>
                        <Form.Label><strong>Quantidade:</strong></Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={produto.quantidade}
                          onChange={(e) => atualizarQuantidade(produto.id, parseInt(e.target.value, 10) || 0)}
                        />
                      </Form.Group>
                      <Button variant="danger" onClick={() => atualizarQuantidade(produto.id, 0)} className="mt-2">
                        <FaTrash /> Remover Item
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <Row>
              <Col xs={12}>
                <h4>Total: R${valorTotal}</h4>
              </Col>
            </Row>
            
            <Row>
              <Col xs={12}>
                <Form.Group controlId="imagemProduto">
                  <Form.Label><strong>Envie imagens para o seu produto:</strong></Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="image/png, application/pdf" 
                    multiple
                    onChange={handleImageChange} 
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-center my-4">
              <Button variant="success" className="me-2" onClick={finalizarPedido}>
                Finalizar Pedido <FaCheck />
              </Button>
              <Link href="/produtos">
                <Button variant="primary">
                  Continuar Comprando <FaShoppingCart />
                </Button>
              </Link>
            </div>
          </>
        )}
      </Container>
    </Pagina>
  );
}


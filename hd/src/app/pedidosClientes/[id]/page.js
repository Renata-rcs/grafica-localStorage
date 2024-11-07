"use client";

import Pagina from "@/app/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Row, Col, Container, Card } from "react-bootstrap";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Page() {
  const route = useRouter();
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");

  useEffect(() => {
    const cliente = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (cliente) {
      setNomeCliente(cliente.nome);

      const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
      const pedidosDoCliente = pedidos.filter(
        (pedido) => pedido.nomeCliente === cliente.nome
      );

      setPedidosCliente(pedidosDoCliente);
    }
  }, []);

  const calcularTotalPedido = (produtos) => {
    return produtos.reduce(
      (total, produto) => total + produto.valorUnitario * produto.quantidade,
      0
    );
  };

  function excluir(id) {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Não, cancelar",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButtonText: "btn btn-secondary",
      },
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        const dados = pedidosCliente.filter((item) => item.id !== id);
        localStorage.setItem("pedidos", JSON.stringify(dados));
        setPedidosCliente(dados);
        Swal.fire({
          title: "Excluído!",
          text: "Registro foi excluído.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    });
  }

  return (
    <Pagina titulo={`Pedidos de ${nomeCliente}`}>
      <Container>
        {pedidosCliente.length === 0 ? (
          <div className="text-center">
            <h5>Nenhum pedido encontrado</h5>
            <p>
              Você ainda não fez nenhum pedido. Adicione produtos para finalizar
              um pedido.
            </p>
            <Link href="/produtos" passHref className="btn btn-primary mx-2">
              <FaShoppingCart /> Comprar Produtos
            </Link>
          </div>
        ) : (
          <>
            <Row>
              {pedidosCliente.map((pedido) => (
                <Col xs={12} key={pedido.id} className="mb-2">
                  <Card>
                    <Card.Body>
                      <Card.Title>✔ Pedido #{pedido.id}</Card.Title>
                      <Card.Text>
                        <strong>Data do Pedido:</strong>{" "}
                        {new Date(pedido.dataPedido).toLocaleDateString()} <br />
                        <strong>Data de Retirada:</strong>{" "}
                        {new Date(pedido.previsaoEntrega).toLocaleDateString()}{" "}
                        <br />
                        <strong>Quantidade Total de Produtos:</strong>{" "}
                        {pedido.produtos.reduce(
                          (total, produto) => total + produto.quantidade,
                          0
                        )}{" "}
                        <br />
                        <strong>Valor Total:</strong> R$
                        {calcularTotalPedido(pedido.produtos).toFixed(2)} <br />
                        <strong>Status:</strong> {pedido.status}
                      </Card.Text>

                      {/* Seção para download das imagens enviadas */}
                      <div className="d-flex align-items-center mb-2">
                        <span>
                          <strong>Artes enviadas:</strong>
                        </span>
                        {pedido.imagemProduto &&
                          (Array.isArray(pedido.imagemProduto) ? (
                            pedido.imagemProduto.map((img, index) => (
                              <a
                                key={index}
                                href={img}
                                download={`imagemProduto_${pedido.id}_${index + 1}.png`}
                                className="ms-2"
                              >
                                <Button variant="link" className="text-primary">
                                  Baixar Img Arte {index + 1}
                                </Button>
                              </a>
                            ))
                          ) : (
                            <a
                              href={pedido.imagemProduto}
                              download={`imagemProduto_${pedido.id}.png`}
                              className="ms-2"
                            >
                              <Button variant="link" className="text-primary">
                                Baixar Imagem
                              </Button>
                            </a>
                          ))}
                      </div>

                      {/* Seção de produtos do pedido */}
                      <Row>
                        {pedido.produtos.map((produto) => (
                          <Col xs={6} md={3} key={produto.id} className="mb-2">
                            <Card className="shadow-sm" style={{height:"150px"}}>
                              {/* <Card.Img
                                variant="top"
                                src={produto.imagemUrl}
                                alt={produto.nome}
                                style={{
                                  maxHeight: "150px",
                                  objectFit: "cover",
                                  padding: "10px",
                                }}
                              /> */}
                              <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                  <Card.Title className="text-center">
                                    {produto.nome}
                                  </Card.Title>
                                </div>
                                <div className="d-flex justify-content-center">
                                  <Link
                                    href="/produtos"
                                    passHref
                                    className="btn btn-primary"
                                  >
                                    <small>
                                      Comprar Novamente
                                      <FaShoppingCart style={{ marginLeft: "2px" }} />
                                    </small>
                                  </Link>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      {/* Botão de exclusão de pedido */}
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="danger"
                          onClick={() => excluir(pedido.id)}
                          disabled={pedido.status !== "Aguardando Pagamento"}
                        >
                          <FaTrash />{" "}
                          {pedido.status === "Aguardando Pagamento"
                            ? "Remover Pedido"
                            : "Remoção Não Permitida"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </Pagina>
  );
}

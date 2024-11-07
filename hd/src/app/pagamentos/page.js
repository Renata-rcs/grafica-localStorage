"use client";

import { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Col, Container } from "react-bootstrap";
import { FaCreditCard, FaPiggyBank } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagina from "../components/Pagina";
import { QRCodeSVG } from "qrcode.react";
import { Formik } from "formik";
import { mask } from "remask";
import PagamentoValidator from "@/validators/PagamentoValidator";
import Swal from "sweetalert2";

export default function Pagamentos() {
  const [exibirPix, setExibirPix] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [nomeCliente, setNomeCliente] = useState("");
  const [formaDePag, setFormaDePag] = useState("");
  const route = useRouter();

  useEffect(() => {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const ultimoPedido = pedidos[pedidos.length - 1];
    if (ultimoPedido) {
      setValorTotal(ultimoPedido.valorTotal);
      const cliente = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (cliente) {
        setNomeCliente(cliente.nome);
      }
    }
  }, []);

  const handlePayment = (values) => {
    Swal.fire({
      title: `Pedido de R$${valorTotal} confirmado!`,
      html: `A nota fiscal será enviado para o seu endereço de e-mail.<br><br>` +
            `Se você ainda não enviou sua arte para os seguinte(s) produto(s), por favor, envie por e-mail mencionando o nome de cada produto com o ID do Pedido!<br><br>` +
            `Lembre-se de que os formatos aceitos são: <strong>PDF e PNG</strong>.`,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: "btn btn-primary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setExibirPix(false);
        
        // Acessa o usuário logado e obtém o ID
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuarioLogado && usuarioLogado.id) {
          // Redireciona para a página de pedidos do cliente usando o ID
          route.push(`/pedidosClientes/${usuarioLogado.id}`); 
        } else {
          console.error("ID do cliente não disponível.");
        }
      }
    });
  };
  
  
  return (
    <Pagina titulo={`Pagamento de ${nomeCliente}`}>
      <Container>
        <Row>
          <Col xs={12}>
            <h4>Total a Pagar: R${valorTotal}</h4>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            <Button
              variant="success"
              onClick={() => setExibirPix(true)}
              className="mx-2"
            >
              <FaPiggyBank /> Pagar com PIX
            </Button>
            <Button
              variant="primary"
              onClick={() => setFormaDePag("cartao")}
              className="mx-2"
            >
              <FaCreditCard /> Pagar com Cartão
            </Button>
          </Col>
        </Row>
        <Modal show={exibirPix} onHide={() => setExibirPix(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Pagamento via PIX</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Valor do Pedido: R${valorTotal}</h5>
            <p>Por favor, faça o pagamento para o seguinte código PIX:</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px 0",
              }}
            >
              <QRCodeSVG value={`Valor: R$ ${valorTotal}`} />
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="secondary" onClick={() => setExibirPix(false)}>
              Fechar
            </Button>
            <Button variant="success" onClick={handlePayment}>
              Confirmar Pagamento
            </Button>
          </Modal.Footer>
        </Modal>

        {formaDePag === "cartao" && (
          <Formik
            initialValues={{
              numeroCartao: "",
              dataValidade: "",
              cvc: "",
            }}
            validationSchema={PagamentoValidator}
            onSubmit={handlePayment}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              setFieldValue,
              errors,
            }) => (
              <Form className="mt-4" onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-3" controlId="numeroCartao">
                      <Form.Label>Número do Cartão</Form.Label>
                      <Form.Control
                        type="text"
                        name="numeroCartao"
                        placeholder="0000 0000 0000 0000"
                        value={values.numeroCartao}
                        onChange={(event) => {
                          const { value } = event.target;
                          const maskedValue = mask(
                            value,
                            "9999 9999 9999 9999"
                          );
                          setFieldValue("numeroCartao", maskedValue);
                        }}
                        isInvalid={errors.numeroCartao}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.numeroCartao}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="data">
                      <Form.Label>Data de Validade</Form.Label>
                      <Form.Control
                        type="text"
                        name="data"
                        value={values.data}
                        placeholder="MM/AA"
                        onChange={(event) => {
                          let { value } = event.target;

                          // Aplica a máscara
                          let maskedValue = mask(value, "99/99");

                          // Extraindo o mês e ano da máscara
                          const month = maskedValue.substring(0, 2);
                          const year = maskedValue.substring(3);

                          // Limita o mês entre 01 e 12
                          if (parseInt(month, 10) > 12) {
                            maskedValue = "12/" + year;
                          }

                          setFieldValue("data", maskedValue);
                        }}
                        isInvalid={errors.data}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.data}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="cvc">
                      <Form.Label>CVC</Form.Label>
                      <Form.Control
                        type="text"
                        name="cvc"
                        value={values.cvc}
                        placeholder="000"
                        onChange={(value) => {
                          setFieldValue(
                             "cvc",
                           mask(value.target.value, "999")
                          );
                        }}
                        isInvalid={errors.cvc}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.cvc}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" className="mt-3" type="submit">
                  Confirmar Pagamento
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Container>
    </Pagina>
  );
}

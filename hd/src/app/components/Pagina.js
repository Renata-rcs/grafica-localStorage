import "../styles/custom.css";
import {
  Col,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Button,
  Modal,
} from "react-bootstrap";
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPaintBrush,
  FaPhoneAlt,
  FaStore,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Pagina(props) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [clienteId, setClienteId] = useState(null);

  const route = useRouter();

  const buscarClienteId = (email) => {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const clienteEncontrado = clientes.find(
      (cliente) => cliente.email.toLowerCase() === email.toLowerCase()
    );

    if (clienteEncontrado) {
      setClienteId(clienteEncontrado.id);

      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (usuarioLogado && usuarioLogado.email === clienteEncontrado.email) {
        // Adiciona o ID ao objeto usuarioLogado
        const usuarioAtualizado = {
          ...usuarioLogado,
          nome: clienteEncontrado.nome,
          id: clienteEncontrado.id,
        };
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify(usuarioAtualizado)
        );
        setUsuarioLogado(usuarioAtualizado);
      }
      return clienteEncontrado.id;
    } else {
      console.log("Cliente não encontrado com o email fornecido.");
      return null;
    }
  };

  const handleDeleteAccount = () => {
    if (clienteId) {
      Swal.fire({
        title: "Você tem certeza?",
        text: "Essa ação não poderá ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Não, cancelar!",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-secondary",
        },
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

          const novosClientes = clientes.filter(
            (cliente) => cliente.id !== clienteId
          );
          localStorage.setItem("clientes", JSON.stringify(novosClientes));

          localStorage.removeItem("usuarioLogado");
          setUsuarioLogado(null);

          console.log("Conta deletada com sucesso.");
          Swal.fire({
            title: "Conta deletada com sucesso!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    }
  };

  useEffect(() => {
    const usuariolog = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuariolog) {
      setUsuarioLogado(usuariolog);
      buscarClienteId(usuariolog.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    route.push("/");
  };

  return (
    <>
      <Navbar
        className="text-light fixed-top mb-5"
        data-bs-theme="dark"
        style={{ backgroundColor: "#001969" }}
        expand="lg" // Torna o Navbar expansível
      >
        <Container>
          <Navbar.Brand href="/">
            <img src="/images/Logo PNG.png" alt="Logo" width={"150px"} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />{" "}
          {/* Botão hamburger */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/orcamentos">Orçamentos</Nav.Link>
              <Nav.Link href="/pedidosClientes">Pedidos</Nav.Link>
              <NavDropdown
                className="custom-dropdown  text-white"
                title="Produtos"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="/produtos">Produtos</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/produtos#cartoesVisita">
                  Cartão de Visita
                </NavDropdown.Item>
                <NavDropdown.Item href="/produtos#panfletos">
                  Panfletos
                </NavDropdown.Item>
                <NavDropdown.Item href="/produtos"> Banner</NavDropdown.Item>
                <NavDropdown.Item href="/produtos">
                  Wind Banner
                </NavDropdown.Item>
                <NavDropdown.Item href="/orcamentos">Placa</NavDropdown.Item>
                <NavDropdown.Item href="/orcamentos">ACM</NavDropdown.Item>
                <NavDropdown.Item href="/orcamentos">
                  Acrílicos
                </NavDropdown.Item>
                <NavDropdown.Item href="/orcamentos">
                  Logomarcas
                </NavDropdown.Item>
                <NavDropdown.Item href="/produtos#cavaletes">
                  Cavaletes
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              {usuarioLogado ? (
                <NavDropdown
                  className="custom-dropdown text-white"
                  title={usuarioLogado.nome}
                  id="user-dropdown"
                >
                  <NavDropdown.Item
                    onClick={() => route.push(`/pedidosClientes/${clienteId}`)}
                  >
                    Meus Pedidos
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`/cadastro/${clienteId}`}>
                    Atualizar Dados
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleDeleteAccount}>
                    Deletar Conta
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <div className="text-center my-5">
        <h1>{props.titulo}</h1>
      </div>

      {props.children}
      <Container>
        <section
          id="artes"
          className="text-center my-5"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 className="mb-4">Envio de Artes</h3>
          <div
            className="artes-content"
            style={{
              marginBottom: "20px",
              fontSize: "1.1em",
              color: "#343a40",
            }}
          >
            <p>
              Caso você não tenha a arte, oferecemos um serviço de criação por
              um valor adicional, dependendo do modelo escolhido.
            </p>
            <p>
              Entre em contato para mais informações sobre os preços e as opções
              de design.
            </p>
          </div>
          <div className="artes-icons row justify-content-center">
            <Col md={4} className="text-center my-3">
              <FaEnvelope size={50} />
              <h5 style={{ fontWeight: "bold", color: "#007bff" }}>
                Envio por E-mail
              </h5>
              <p style={{ color: "#6c757d" }}>
                Facilidade e rapidez no envio da sua arte.
              </p>
              <p style={{ color: "#343a40" }}>
                <a
                  href="mailto:contato@hdimpressao.com"
                  style={{ textDecoration: "none", color: "#007bff" }}
                >
                  contato@hdimpressao.com
                </a>
              </p>
            </Col>
            <Col md={4} className="text-center my-3">
              <FaPaintBrush size={50} />
              <h5 style={{ fontWeight: "bold", color: "#007bff" }}>
                Criação de Arte
              </h5>
              <p style={{ color: "#6c757d" }}>
                Desenvolvemos sua arte de acordo com suas necessidades.
              </p>
            </Col>
            <Col md={4} className="text-center my-3">
              <FaPhoneAlt size={50} />
              <h5 style={{ fontWeight: "bold", color: "#007bff" }}>
                Entre em Contato
              </h5>
              <p style={{ color: "#6c757d" }}>
                Fale conosco para mais informações.
              </p>
              <p style={{ color: "#343a40" }}>
                <a
                  href="tel:+556120200000"
                  style={{ textDecoration: "none", color: "#007bff" }}
                >
                  (61) 2020-0000
                </a>
              </p>
            </Col>
          </div>
        </section>
      </Container>
      <footer
        style={{ backgroundColor: "lightgray"}}
        className="py-4 text-light"
      >
        <Container>
          <Row className="mt-2" >
            <Col
              md={3}
              className="text-center"
              xs={12}
            >
              <h6>Contato/Endereço</h6>
              <p className="text-small">
                Qnn 8 Ceilândia Sul, 72220089
                <br />
                Telefone: (61) 2020-0000
                <br />
                WhatsApp: (61) 9 8000-0000
              </p>
            </Col>
            <Col
              md={3}
              className="text-center"
              xs={12} 
            >
              <h6>Sobre</h6>
              <p className="text-small">
                HD Mídia é especialista em impressão de alta qualidade,
                oferecendo soluções personalizadas com uma equipe experiente e
                equipamentos modernos. Comprometidos com a excelência,
                garantimos atendimento ágil e produtos que fazem a diferença
                para o seu negócio.
              </p>
            </Col>
            <Col
              md={3}
              className="text-center"
              xs={12} 
            >
              <h6>Produtos</h6>
              <p className="text-small">
                Cartões de Visita
                <br />
                Panfletos
                <br />
                Banner
                <br />
                Placa
                <br />
                ACM
                <br />
                Acrílico
                <br />
                Logomarcas
                <br />
                Sites
              </p>
            </Col>
            <Col
              md={3}
              className="text-center"
              xs={12} 
            >
              <h6>Funcionamento</h6>
              <p className="text-small">
                Segunda: 09:00-18:00 <br />
                Terça: 09:00-18:00 <br />
                Quarta: 09:00-18:00 <br />
                Quinta: 09:00-18:00 <br />
                Sexta: 09:00-18:00 <br />
                Sábado: 09:00-12:00
              </p>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={12} className="text-center">
              <h6>Forma de Entrega</h6>
              <p className="text-small">Retirada em loja</p>
              <div>
                <FaStore />
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={12} className="text-center">
              <p className="text-small">
                © 2024 HD Mídia. Todos os direitos reservados.
              </p>
            </Col>
          </Row>
          <Row className="my-2">
            <Col className="text-center">
              <p className="text-small">By: Renata Carvalho</p>
              <a
                href="https://www.linkedin.com/in/renata-carvalho-02a718273"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white" }}
                className="mx-2"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/Renata-rcs"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white" }}
                className="mx-2"
              >
                <FaGithub />
              </a>
              <a
                href="https://instagram.com/renata_rcs"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white" }}
                className="mx-2"
              >
                <FaInstagram />
              </a>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

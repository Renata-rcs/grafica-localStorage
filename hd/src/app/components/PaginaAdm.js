import { Container, Nav, Row, Col } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PaginaAdm(props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado"); 
    router.push("/"); 
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" /> 
      </Head>
    <Container fluid className="p-0">
      <Row style={{ height: '100vh' }}>
        <Col md={2} className=" d-flex flex-column" style={{backgroundColor: '#001969', minHeight: '100vh' }}>
        <Nav className="flex-column" style={{ flexGrow: 1 }}>
            <Nav.Link href="/adm" className="text-white my-4" style={{ textAlign: 'center' }}>
              <img
                src="/images/icone.png" 
                alt="Logo"
                width="50px"
              />
            </Nav.Link>
            <Nav.Link href="/adm/clientes" className="text-white" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>Clientes</Nav.Link>
            <Nav.Link href="/adm/contatos" className="text-white" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>Contatos</Nav.Link>
            <Nav.Link href="/adm/pedidos" className="text-white" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>Pedidos</Nav.Link>
            <Nav.Link href="/adm/servicos" className="text-white" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>Serviços</Nav.Link>
            <Nav.Link href="/adm/funcionarios" className="text-white" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>Funcionários</Nav.Link>
            <Nav.Link href="/adm/produtos" className="text-white" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>Produtos</Nav.Link>
            <Nav.Link href="/adm/orcamentosVisita" className="text-white">Orçamento Mediante Visita</Nav.Link>
          </Nav>
          <Nav className="flex-column mb-3" style={{ marginTop: 'auto' }}>
            <Nav.Link onClick={handleLogout} className="text-white">
              <FaSignOutAlt style={{ marginRight: '8px', transform: 'scaleX(-1)' }} /> Sair da Conta
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={10}>
          <div className="text-center my-5">
            <h1>{props.titulo}</h1>
          </div>
          <Container>{props.children}</Container>
        </Col>
      </Row>
    </Container>
    <style jsx>{`
        @media (max-width: 768px) {
          .nav-link {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

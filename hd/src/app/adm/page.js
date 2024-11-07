"use client"

import PaginaAdm from "@/app/components/PaginaAdm";
import { Formik } from "formik";
import { Col, Form, Row, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function Page() {

    const [error, setError] = useState('');  
    const [produtos, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]); 
    const [graficoDados, setGraficoDados] = useState(null);  
    const [graficoBarrasDados, setGraficoBarrasDados] = useState(null);  
    const [mensagem, setMensagem] = useState(''); 
    const [pedidos, setPedidos] = useState([]);

    
    useEffect(() => {
        const produtosArmazenados = JSON.parse(localStorage.getItem("produtos")) || []
        const pedidosArmazenados = JSON.parse(localStorage.getItem("pedidos")) || []
        setProdutos(produtosArmazenados);  // Atualiza o estado dos produtos
        setPedidos(pedidosArmazenados);  // Atualiza o estado dos pedidos
        console.log("Produtos carregados do localStorage:", produtosArmazenados)
        console.log("Pedidos carregados do localStorage:", pedidosArmazenados)
    }, []); 

    // Função para calcular as vendas por mês ao longo do ano
    const calcularVendasAno = () => {
        const vendasPorMes = Array(12).fill(0);  // Inicializa um array com 12 zeros, um para cada mês
        pedidos.forEach(pedido => {  // Itera sobre todos os pedidos
            const dataPedido = new Date(pedido.dataPedido);  // Cria uma data a partir da data do pedido
            const mes = dataPedido.getMonth();  // Obtém o mês do pedido (0-11)
            pedido.produtos.forEach(produto => {  // Itera sobre os produtos no pedido
                const produtoEncontrado = produtos.find(p => p.id === produto.id);  // Busca o produto na lista de produtos
                if (produtoEncontrado) {
                    vendasPorMes[mes] += produtoEncontrado.valorUnitario * produto.quantidade;  // Soma as vendas do mês
                }
            });
        });
        console.log("Vendas por mês:", vendasPorMes); 
        return vendasPorMes;  // Retorna o total de vendas por mês
    };

    // Função chamada ao submeter o formulário
    const salvar = (values) => {
        if (!values.mesAno) {  // Verifica se o campo de mês e ano foi preenchido
            setError('Mês e ano são obrigatórios') // Exibe um erro se o campo não foi preenchido
            console.error("Erro:", error) // Log do erro
            return;
        } else {
            setError('');  // Limpa o erro
        }
    
        const mesAnoSelecionado = values.mesAno // Extrai o valor do mês e ano selecionado
        const dataSelecionada = new Date(mesAnoSelecionado + "-01") // Cria uma data a partir do mês e ano selecionado
        const mesSelecionado = dataSelecionada.getMonth() // Obtém o mês selecionado
    
        const vendasContadas = {};  // Objeto para contar as vendas por produto
        let totalVendasMes = 0;  // Variável para armazenar o total de vendas do mês
    
        pedidos.forEach(pedido => {  // Itera sobre os pedidos
            const dataPedido = new Date(pedido.dataPedido) // Cria uma data para o pedido
            const mesAnoPedido = `${dataPedido.getFullYear()}-${String(dataPedido.getMonth() + 1).padStart(2, '0')}`  // Cria uma string no formato "YYYY-MM"
    
            if (mesAnoPedido === mesAnoSelecionado) {  // Verifica se o pedido é do mês selecionado
                console.log("Pedido:", pedido) // Log do pedido para debug
                pedido.produtos.forEach(produto => {  // Itera sobre os produtos do pedido
                    console.log("Produto do pedido:", produto);  // Log do produto para debug
                    const produtoEncontrado = produtos.find(p => p.id === produto.id) // Busca o produto na lista
                    if (produtoEncontrado) {  // Se o produto for encontrado
                        if (vendasContadas[produto.id]) {  // Se já houver o produto nas vendas contadas
                            vendasContadas[produto.id].quantidade += produto.quantidade; // Soma a quantidade vendida
                        } else {
                            vendasContadas[produto.id] = {  // Caso contrário, adiciona o produto nas vendas contadas
                                nome: produto.nome,
                                quantidade: produto.quantidade,
                                valorUnitario: produtoEncontrado.valorUnitario,
                            };
                        }
                        totalVendasMes += produtoEncontrado.valorUnitario * produto.quantidade // Soma o valor das vendas
                    } else {
                        console.warn(`Produto não encontrado: ${produto.id}`) // Log de aviso caso o produto não seja encontrado
                    }
                });
            }
        });
    
        const vendasFiltradas = Object.values(vendasContadas).sort((a, b) => b.quantidade - a.quantidade) // Ordena as vendas por quantidade
        setVendas(vendasFiltradas);  // Atualiza o estado das vendas

        if (vendasFiltradas.length === 0) {  // Se não houver vendas
            setMensagem("Não há vendas no mês selecionado.");  // Exibe a mensagem
            setGraficoDados(null);  // Limpa o gráfico de pizza
            setGraficoBarrasDados(null);  // Limpa o gráfico de barras
        } else {
            setMensagem('');  // Limpa a mensagem de erro

            // Dados para o gráfico de pizza
            const labels = vendasFiltradas.map(v => v.nome);
            const data = vendasFiltradas.map(v => v.quantidade);
            const backgroundColors = vendasFiltradas.map(() => `hsl(${Math.random() * 360}, 100%, 75%)`);

            setGraficoDados({  // Atualiza os dados do gráfico de pizza
                labels,
                datasets: [{
                    label: 'Vendas',
                    data,
                    backgroundColor: backgroundColors,
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1,
                }],
            });

            // Dados para o gráfico de barras
            const vendasPorMes = calcularVendasAno();
            const totalVendasAno = vendasPorMes.reduce((acc, val) => acc + val, 0);
            const totalVendasAtual = vendasPorMes[mesSelecionado];

            console.log("Dados do gráfico de barras:", {
                vendasPorMes,
                totalVendasAno,
                totalVendasAtual
            });

            setGraficoBarrasDados({  // Atualiza os dados do gráfico de barras
                labels: [
                    'Janeiro', 'Fevereiro', 'Março', 'Abril',
                    'Maio', 'Junho', 'Julho', 'Agosto',
                    'Setembro', 'Outubro', 'Novembro', 'Dezembro',
                    'Total do Ano'
                ],
                datasets: [
                    {
                        label: 'Total de Vendas por Mês',
                        data: [...vendasPorMes, totalVendasAno], 
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }
                ]
            });
        }
    };

    const initialValues = {
        mesAno: '',
    };



    return (
        <PaginaAdm titulo="Análise de Vendas">
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => salvar(values)}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group controlId="mesAno">
                                    <Form.Label>Mês e Ano:</Form.Label>
                                    <Form.Control
                                        type="month"
                                        name="mesAno"
                                        value={values.mesAno}
                                        onChange={(e) => {
                                            handleChange(e);
                                            if (!e.target.value) {
                                                setError('Mês e ano são obrigatórios');
                                            } else {
                                                setError('');
                                            }
                                        }}
                                        isInvalid={!!error}
                                    />
                                    {error && (
                                        <Form.Control.Feedback type="invalid">
                                            {error}
                                        </Form.Control.Feedback>
                                    )}
                                    <Form.Text muted>
                                        Selecione o mês e o ano para visualizar as vendas.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary" className="my-3" style={{ backgroundColor: '#001969' }}>Analisar</Button>
                    </Form>
                )}
            </Formik>

            {mensagem && <p className="mt-4 text-danger">{mensagem}</p>}

            {vendas.length > 0 && (
                <Row className="mt-4">
                    <Col md={4} className="d-flex flex-column align-items-center ms-2 my-4">
                        <h5>Gráfico de Vendas</h5>
                        {graficoDados && <Pie data={graficoDados} style={{ maxHeight: '300px' }} />}
                    </Col>
                    <Col md={7} className="d-flex flex-column align-items-center ms-2 my-4">
                        <h5>Total de Vendas por Mês</h5>
                        {graficoBarrasDados && <Bar data={graficoBarrasDados} style={{ height: '200px' }} />}
                    </Col>
                    <Col md={12} className="d-flex flex-column align-items-center ms-2 my-4">
                        <div style={{ padding: '20px', width: '100%' }}>
                            <h5 className="text-center">Produtos Vendidos</h5>
                            <div style={{ overflow: 'auto', width: '100%' }}>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">Produto</th>
                                            <th scope="col">Quantidade</th>
                                            <th scope="col">Valor Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendas.map((produto, index) => (
                                            <tr key={index}>
                                                <td>{produto.nome}</td>
                                                <td>{produto.quantidade}</td>
                                                <td>R$ {(produto.valorUnitario * produto.quantidade).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </PaginaAdm>
    );
}


 
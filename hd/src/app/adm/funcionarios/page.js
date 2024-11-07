"use client";

import Link from "next/link";
import { FaPlusCircle, FaArrowLeft, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { mask } from 'remask';
import Swal from "sweetalert2";
import PaginaAdm from "@/app/components/PaginaAdm";
import "../../styles/form.css";

export default function Page() {
  const [funcionarios, setfuncionarios] = useState([]);

  useEffect(() => {
    setfuncionarios(JSON.parse(localStorage.getItem("funcionarios")) || []);
  }, []);

  function excluir(id) {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Não, cancelar!",
      customClass: {
        confirmButton: 'btn btn-primary', 
        cancelButton: 'btn btn-secondary' 
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        const dados = funcionarios.filter((item) => item.id !== id);
        localStorage.setItem("funcionarios", JSON.stringify(dados));
        setfuncionarios(dados);
        Swal.fire({
          title: "Excluído!",
          text: "Registro foi excluído.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: 'btn btn-primary' 
          }
        });
      }
    });
  }

  return (
    <PaginaAdm titulo="Funcionários">
      <Link href="/adm/funcionarios/form" className="btn text-white mb-3" style={{backgroundColor: '#001969'}}>
        <FaPlusCircle /> Novo 
      </Link>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Data de Contratação</th>
            <th>Cargo</th>
            <th>Salário</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((item) => (
            <tr key={item.id}>
              <td>
                <Link href={`/adm/funcionarios/form/${item.id}`}>
                  <FaEdit className="text-primary" />
                </Link>
                <MdDelete
                  title="Excluir"
                  className="text-danger"
                  onClick={() => excluir(item.id)}
                />
              </td>
              <td>{item.nome}</td>
              <td>{item.cpf}</td>
              <td>{item.telefone}</td>
              <td>{item.email}</td>
              <td>{item.dataContratacao}</td>
              <td>{item.cargo}</td>
              <td>{item.salario}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Link href="/" className="btn text-white ms-2" style={{backgroundColor: '#001969'}}>
        <FaArrowLeft /> Home
      </Link>
    </PaginaAdm>
  );
}

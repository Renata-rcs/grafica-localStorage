import * as Yup from 'yup';

const FuncionarioValidator = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  cpf: Yup.string()
    .min(10, 'O mínimo de caracteres é 10')
    .max(14, 'O máximo de caracteres é 14!')
    .required('Campo Obrigatório'),

  telefone: Yup.string()
    .min(10, 'O mínimo de caracteres é 10')
    .max(15, 'O máximo de caracteres é 15!')
    .required('Campo Obrigatório'),

  cargo: Yup.string()
    .min(5, 'O mínimo de caracteres é 5')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  salario: Yup.string()
  .required('Campo Obrigatório'),

  dataContratacao: Yup.date()
  .required('Campo Obrigatório'),

  
});

export default FuncionarioValidator;

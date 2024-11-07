import * as Yup from 'yup';

const OrcamentoValidator = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  email: Yup.string()
    .email('Digite um email válido!')
    .required('Campo Obrigatório'),

  telefone: Yup.string()
    .min(10, 'O mínimo de caracteres é 10')
    .max(15, 'O máximo de caracteres é 15!')
    .required('Campo Obrigatório'),

  detalhes: Yup.string()
    .max(500, 'O máximo de caracteres é 500!')
    .required('Campo Obrigatório'),

});

export default OrcamentoValidator;

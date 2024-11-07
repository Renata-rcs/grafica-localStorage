import * as Yup from 'yup';

const CadastroValidator = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  cpf: Yup.string()
    .min(11, 'O mínimo de caracteres é 11')
    .max(14, 'O máximo de caracteres é 14!')
    .required('Campo Obrigatório'),


  telefone: Yup.string()
   .min(8, 'O mínimo de caracteres é 8')
   .max(15, 'O máximo de caracteres é 15!')
   .required('Campo Obrigatório'),

  email: Yup.string()
    .email('Digite um email válido!')
    .required('Campo Obrigatório'),

  senha: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('Campo Obrigatório'),

  pais: Yup.string()
    .required('Campo Obrigatório')
    .default('Brasil'),

  uf: Yup.string()
    .length(2, 'A UF deve ter 2 caracteres')
    .required('Campo Obrigatório'),

  cidade: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  cep: Yup.string()
    .min(8, 'O mínimo de caracteres é 8')
    .max(9, 'O máximo de caracteres é 9!')
    .required('Campo Obrigatório'),

  logradouro: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(100, 'O máximo de caracteres é 100!')
    .required('Campo Obrigatório'),

  bairro: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(50, 'O máximo de caracteres é 50!')
    .required('Campo Obrigatório'),

  numero: Yup.string()
    .required('Campo Obrigatório'),

  complemento: Yup.string()
    .max(50, 'O máximo de caracteres é 50!'),
});

export default CadastroValidator;

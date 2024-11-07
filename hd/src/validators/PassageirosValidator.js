import * as Yup from 'yup';

const PassageirosValidator = Yup.object().shape({
  nomeCompleto: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(30, 'O máximo de caracteres é 30!')
    .required('Campo Obrigatório!'),
  
  tipoDocumento: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(30, 'O máximo de caracteres é 30!')
    .required('Campo Obrigatório!'),
  
  documento: Yup.string()
    .min(3, 'O mínimo de caracteres é 3')
    .max(30, 'O máximo de caracteres é 30!')
    .required('Campo Obrigatório!'),
  
  email: Yup.string()
    .email('Digite um email válido!')
    .required('Campo Obrigatório!'),
  
  telefone: Yup.number()
    .required('Campo Obrigatório!'),
  
  dataNascimento: Yup.date()
    .required('Campo Obrigatório!')
});

export default PassageirosValidator;

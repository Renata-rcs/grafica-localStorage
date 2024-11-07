import * as Yup from 'yup';

const LoginValidator = Yup.object().shape({
  email: Yup.string()
    .email('Digite um email válido!')
    .required('Campo Obrigatório'),

  senha: Yup.string() 
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .required('Campo Obrigatório'),
});

export default LoginValidator;

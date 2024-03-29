import {useState} from 'react'
import './Register.css'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'

import InputField from '../../ui/components/inputs/Input'
import SelectField from '../../ui/components/inputs/Select'
import { verifyCode, sendUser } from '../../data/services/register/register'
import { Cursos } from './Cursos'
import Swal from 'sweetalert2'

const Register = () => {
  const navigate = useNavigate();
  const [curso, setCurso] = useState("");
  const [cursoError, setCursoError] = useState('');
  const [step, setStep] = useState(1);

  const { 
    register,
    handleSubmit,
    formState: { errors, isValid},
  } = useForm({ mode: "onBlur"})

  const registerUser = async (data) => {
    if (!curso) {
      setCursoError('Coloque seu Curso!');
      return;
    }
    sendUser(data).then(() => {
      Swal.fire({
        icon: "success",
        title: "Valide o Código que irá chegar em sua caixa de Email",
        showConfirmButton: false,
        timer: 1500
      })
      setStep(2);
    })
  }

  const sendCode = async (data) => {
    verifyCode(data).then(() => {
      Swal.fire({
        icon: "success",
        title: "Cadastrado com Sucesso",
        text: "Seja bem vindo a nossa comunidade!",
        confirmButtonText: "Vamos!"
    }).then(() => {
      navigate('/login');
    });
    }).catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Codigo Incorreto",
        text: "Verifique e tente novamente",
        confirmButtonText: "Continuar"
      })
    })
  }

  return (
    <section className='register-container container-xl d-flex p-0' >
      <div className='information p-5 position-relative'>
        <div className='p-5 text-center '>
          <h2 className='fs-1 fw-bold pb-4'>Seja Bem Vindo!</h2>
          <p className='fs-5 fw-light'>
            Caso tenha uma conta clique no link abaixo para autenticar-se ao site
          </p>
          <p className='fs-5 fw-light'>
            O cadastro no site é exclusivo para estudantes da instituição e que possuem um email acadêmico
          </p>
        </div>
        <div className='position-absolute w-100 text-center link-info'>
          <a href="/login" className='fs-3'> Logar-se </a>
        </div>
      </div>
      <div className='login-form p-5 text-center d-flex justify-content-center'>
        { step === 1 ? (<form className="d-flex flex-column" onSubmit={handleSubmit(registerUser)}>
          <h1 className='fs-1'>CADASTRO</h1>
          <p className='fs-4' style={{color: "#393646"}}>Cadastre-se e seja bem vindo a nossa comunidade</p>

          <div className="form-group pt-3">
            <InputField 
              label="Nome"
              type="text"
              id="nome"
              placeholder="Seu Nome"
              className='me-2 py-2 px-3 fs-5'
              registerOptions={register("nome",
              { required: true, minLength: 3,
                validate: {
                  noSpecialChars: value => /^[a-zA-Z0-9 ]*$/.test(value) || 'No special characters allowed'
              }})}
              errors={errors.nome}
            />

            <div className="w-100 text-start">
              <label htmlFor="seletor" className='form-label'>Curso</label>
              <SelectField 
                options={Cursos}
                defaultValue={{}}
                onChange={val => {
                  setCurso(val.value);
                  setCursoError('');
                }}
              />
              {cursoError && <small>{cursoError}</small>}
            </div>
          </div>

          <InputField 
            label="Email"
            type="email"
            id="email"
            placeholder="Seu Email"
            className=' py-2 px-3 fs-5'
            registerOptions={register("email", {
              required: true,
            })}
            errors={errors.email}
          />
          <InputField 
            label="Sua Senha"
            type="password"
            id="password"
            placeholder="Sua Senha"
            className=' py-2 ps-3 fs-5 pass'
            registerOptions={register("password",
            { required: true,
              minLength: 6,
              validate: {
                hasNumber: value => /\d/.test(value) || 'A senha deve conter pelo menos um número',
                hasSpecialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'A senha deve conter pelo menos um caractere especial'
            }})}
            errors={errors.password}
          />

          <button type='submit' className="btn button-outline mx-5 fs-4 mb-3" >
            Cadastrar
          </button>
        </form>) : (
        <form className='d-flex flex-column gap-5' onSubmit={handleSubmit(sendCode)}>
          <h2>Acabamos de enviar um email de Confirmação!</h2>
          <p className='fs-4'>
            Um código de verificação foi enviado para o seu gmai, verifique as caixas de mensagens bem como a de spam. O código deve chegar em alguns minutos, fique no aguardo
          </p>
          <input type="text" />
          <button className="btn button-outline mx-5 fs-3 mb-3">
            Validar
          </button>
          <button className="btn button-outline mx-5 fs-5 mb-3" type='submit'>
            Enviar Novamente
          </button>
        </form>)}
      </div>
    </section>
  )
}

export default Register
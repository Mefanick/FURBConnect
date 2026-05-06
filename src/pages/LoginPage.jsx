import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logoFurbConnect from '../assets/Logo furbconnect.png'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('nicolas.voigt@furb.br')

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const fd = new FormData(form)
    const em = String(fd.get('email') || email || 'nicolas.voigt@furb.br')
    login(em, String(fd.get('password') || ''))
    navigate('/home', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <Link to="/home" className="auth-brand auth-brand--home">
          <img
            className="auth-brand__logo"
            src={logoFurbConnect}
            alt="FURB Connect"
            width={72}
            height={72}
          />
          <h1 className="auth-brand__title">
            <span className="auth-brand__furb">FURB</span>{' '}
            <span className="auth-brand__connect">Connect</span>
          </h1>
          <p className="auth-brand__subtitle">Comunidade Acadêmica</p>
        </Link>

        <div className="auth-card">
          <h2 className="auth-card__title">Entrar</h2>
          <p className="auth-card__demo">
            Modo demonstração: você acessa como <strong>Nicolas Voigt</strong> (qualquer senha).
          </p>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-field">
              <span className="auth-field__label">Email</span>
              <input
                className="auth-field__input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="seuemail@furb.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="auth-field">
              <span className="auth-field__label">Senha</span>
              <input
                className="auth-field__input"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Mínimo 6 caracteres"
              />
            </label>
            <button type="submit" className="auth-submit">
              Entrar
            </button>
          </form>
          <p className="auth-links">
            <a className="auth-links__item" href="#recuperar">
              Esqueci minha senha
            </a>
          </p>
          <p className="auth-footer">
            <span className="auth-footer__muted">Não tem conta? </span>
            <Link className="auth-footer__link" to="/home">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

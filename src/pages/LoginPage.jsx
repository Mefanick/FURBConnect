import { Link } from 'react-router-dom'
import logoFurbConnect from '../assets/Logo furbconnect.png'
import './LoginPage.css'

export default function LoginPage() {
  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="auth-page">
      <div className="auth-page__inner">
        <Link to="/" className="auth-brand auth-brand--home">
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
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-field">
              <span className="auth-field__label">Email</span>
              <input
                className="auth-field__input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="seuemail@furb.br"
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
            <Link className="auth-footer__link" to="/">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

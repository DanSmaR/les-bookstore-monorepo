import {
  Button,
  Card,
  Form,
  FormField,
  FormSection,
  NavigationLink,
} from '@/components'
import { ROUTES } from '@/routes/constants'
import {
  genderOptions,
  residenceTypeOptions,
  stateOptions,
} from '@/utils/constants'

import { Header } from './components'
import * as S from './styles'
import { useSignUp } from './use-sign-up'

export const SignUp = () => {
  const { form, onSubmit, isLoading } = useSignUp()

  return (
    <S.Container>
      <S.ContentWrapper>
        <Header />

        <Card>
          <Form form={form} onSubmit={onSubmit}>
            {/* Personal Data Section */}
            <FormSection title="Dados Pessoais">
              <FormField
                form={form}
                name="name"
                type="text"
                label="Nome Completo"
                placeholder="Seu nome completo"
                data-testid="name-input"
              />

              <FormField
                form={form}
                name="cpf"
                type="cpf"
                label="CPF"
                placeholder="000.000.000-00"
                data-testid="cpf-input"
              />

              <FormField
                form={form}
                name="email"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                data-testid="email-input"
              />

              <FormField
                form={form}
                name="phone"
                type="phone"
                label="Telefone"
                placeholder="(11) 99999-9999"
                data-testid="phone-input"
              />

              <FormField
                form={form}
                name="gender"
                type="select"
                label="Gênero"
                placeholder="Selecione"
                options={genderOptions}
                data-testid="gender-select"
              />

              <FormField
                form={form}
                name="birthDate"
                type="date"
                label="Data de Nascimento"
                placeholder="DD/MM/AAAA"
                data-testid="birth-date-input"
              />

              <FormField
                form={form}
                name="password"
                type="password"
                label="Senha"
                data-testid="password-input"
              />

              <FormField
                form={form}
                name="confirmPassword"
                type="password"
                label="Confirmar Senha"
                data-testid="confirm-password-input"
              />
            </FormSection>

            {/* Address Section */}
            <FormSection title="Endereço">
              <FormField
                form={form}
                name="address.zipCode"
                type="zipCode"
                label="CEP"
                placeholder="00000-000"
                data-testid="zip-code-input"
              />

              <FormField
                form={form}
                name="address.street"
                type="text"
                label="Rua"
                placeholder="Nome da rua"
                data-testid="street-input"
              />

              <FormField
                form={form}
                name="address.number"
                type="text"
                label="Número"
                placeholder="123"
                data-testid="number-input"
              />

              <FormField
                form={form}
                name="address.complement"
                type="text"
                label="Complemento"
                placeholder="Apartamento, bloco, etc."
                data-testid="complement-input"
              />

              <FormField
                form={form}
                name="address.neighborhood"
                type="text"
                label="Bairro"
                placeholder="Nome do bairro"
                data-testid="neighborhood-input"
              />

              <FormField
                form={form}
                name="address.city"
                type="text"
                label="Cidade"
                placeholder="São Paulo"
                data-testid="city-input"
              />

              <FormField
                form={form}
                name="address.state"
                type="select"
                label="Estado"
                placeholder="Selecione o estado"
                options={stateOptions}
                data-testid="state-select"
              />

              <FormField
                form={form}
                name="address.residenceType"
                type="select"
                label="Tipo de Residência"
                placeholder="Selecione"
                options={residenceTypeOptions}
                data-testid="residence-type-select"
              />

              <FormField
                form={form}
                name="address.identifier"
                type="text"
                label="Identificador do Endereço"
                placeholder="Casa, Trabalho, etc."
                data-testid="address-identifier-input"
              />
            </FormSection>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              data-testid="submit-button"
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </Form>
        </Card>

        <S.LoginLink>
          <S.LoginText>
            Já tem uma conta?{' '}
            <NavigationLink to={ROUTES.SIGNIN} variant="primary">
              Fazer login
            </NavigationLink>
          </S.LoginText>
        </S.LoginLink>
      </S.ContentWrapper>
    </S.Container>
  )
}

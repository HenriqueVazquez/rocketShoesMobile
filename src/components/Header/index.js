import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Logo,
  BasketContainer,
  ItemCount,
  BackToHome,
} from './styles';

function Header({ navigation, cartSize }) {
  let cartMess = ``;

  switch (cartSize) {
    case 0:
      cartMess = 'Seu carrinho está vazio.';
      break;
    case 1:
      cartMess = `O carrinho tem ${cartSize} item`;
      break;
    default:
      cartMess = `O carrinho tem ${cartSize} itens`;
  }
  return (
    <Container>
      <BackToHome
        accessibilityLabel="logo da RocketShoes"
        accessibilityHint="Clique duas vezes para voltar para a página inicial"
        onPress={() => navigation.navigate('Main')}
      >
        <Logo />
      </BackToHome>
      <BasketContainer
        onPress={() => navigation.navigate('Cart')}
        accessibilityLabel={`${cartMess}`}
        accessibilityHint="Clique duas vezes para acessar o carrinho"
      >
        <Icon name="shopping-basket" color="#FFF" size={24} />
        <ItemCount accessibilityLabel={`${cartMess}`}>
          {cartSize || 0}
        </ItemCount>
      </BasketContainer>
    </Container>
  );
}

Header.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  cartSize: PropTypes.number.isRequired,
};

export default connect(
  (state) => ({
    cartSize: state.cart.length,
  }),
  null
)(Header);

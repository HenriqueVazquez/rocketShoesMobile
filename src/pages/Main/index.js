import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import * as CartActions from '../../store/modules/cart/actions';

import api from '../../services/api';
import { formatPrice } from '../../util/format';

import {
  Container,
  ProductImage,
  ProductTitle,
  ProductPrice,
  Product,
  AddButton,
  ViewProductAmount,
  ProductAmountText,
  AddButtonText,
  ListProducts,
} from './styles';

class Main extends React.Component {
  static navigationOptions = {
    title: 'RocketShoes',
  };

  constructor(props) {
    super(props);

    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    const response = await api.get('/products');

    const data = response.data.map((product) => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data });
  };

  handleAddProduct = (id) => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  renderProduct = ({ item }) => {
    const { amount } = this.props;

    return (
      <Product key={item.id}>
        <ProductImage
          source={{ uri: item.image }}
          acessible
          accessibilityLabel={`Imagem do ${item.title}`}
        />
        <ProductTitle>{item.title}</ProductTitle>
        <ProductPrice
          accessibilityLabel={`O valor do ${item.title} é ${formatPrice(
            item.price
          )}`}
        >
          {formatPrice(item.price)}
        </ProductPrice>
        <AddButton
          onPress={() => this.handleAddProduct(item.id)}
          accessibilityLabel={
            amount[item.id]
              ? `O carrinho possui ${amount[item.id]} ${item.title} adicionados`
              : 'o carrinho não possui esse item'
          }
          accessibilityHint={
            amount[item.id]
              ? 'Clique duas vezes para adicionar mais um deste item ao carrinho'
              : 'Clique duas vezes para adicionar ao carrinho'
          }
        >
          <ViewProductAmount>
            <Icon name="add-shopping-cart" color="#FFF" size={20} />
            <ProductAmountText>{amount[item.id] || 0}</ProductAmountText>
          </ViewProductAmount>
          <AddButtonText>ADICIONAR</AddButtonText>
        </AddButton>
      </Product>
    );
  };

  render() {
    const { products } = this.state;

    return (
      <Container>
        <ListProducts
          data={products}
          extraData={this.props}
          keyExtractor={(product) => String(product.id)}
          renderItem={this.renderProduct}
        />
      </Container>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
  }).isRequired,
  addToCartRequest: PropTypes.func.isRequired,
  amount: PropTypes.shape({
    id: PropTypes.number,
    amount: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  amount: state.cart.reduce((amount, product) => {
    // eslint-disable-next-line no-param-reassign
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import * as CartActions from '../../store/modules/cart/actions';

import { formatPrice } from '../../util/format';
import colors from '../../styles/colors';
import {
  Container,
  Products,
  Product,
  ProductInfo,
  ProductImage,
  ProductDetails,
  ProductTitle,
  ProductPrice,
  ProductDelete,
  ProductControls,
  ProductControlButton,
  ProductAmount,
  ProductSubtotal,
  TotalContainer,
  TotalText,
  TotalAmount,
  Order,
  OrderText,
  EmptyContainer,
  EmptyText,
} from './styles';

function Cart({ products, total, removeFromCart, updateAmountRequest }) {
  function decrement(product) {
    updateAmountRequest(product.id, product.amount - 1);
  }

  function increment(product) {
    updateAmountRequest(product.id, product.amount + 1);
  }

  return (
    <Container>
      {products.length ? (
        <>
          <Products>
            {products.map((product) => (
              <Product key={product.id}>
                <ProductInfo>
                  <ProductImage
                    source={{ uri: product.image }}
                    acessible
                    accessibilityLabel={`Imagem do ${product.title}`}
                  />
                  <ProductDetails>
                    <ProductTitle>{product.title}</ProductTitle>
                    <ProductPrice>{product.priceFormatted}</ProductPrice>
                  </ProductDetails>
                  <ProductDelete
                    onPress={() => removeFromCart(product.id)}
                    accessibilityLabel={`botão para remover ${product.title} do carrinho`}
                    accessibilityHint={`Clique duas vezes para remover o ${product.title} do carrinho`}
                  >
                    <Icon
                      name="delete-forever"
                      size={24}
                      color={colors.primary}
                    />
                  </ProductDelete>
                </ProductInfo>
                <ProductControls>
                  <ProductControlButton
                    onPress={() => decrement(product)}
                    accessibilityLabel={`botão para remover um ${product.title} do carrinho`}
                    accessibilityHint={`Clique duas vezes para remover um ${product.title} do carrinho`}
                  >
                    <Icon
                      name="remove-circle-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </ProductControlButton>
                  <ProductAmount value={String(product.amount)} />
                  <ProductControlButton
                    onPress={() => increment(product)}
                    accessibilityLabel={`botão para adicionar um ${product.title} do carrinho`}
                    accessibilityHint={`Clique duas vezes para adicionar um ${product.title} do carrinho`}
                  >
                    <Icon
                      name="add-circle-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </ProductControlButton>
                  <ProductSubtotal
                    accessibilityLabel={`O total de ${product.amount} ${product.title} está com um subtotal de ${product.subtotal}`}
                  >
                    {product.subtotal}
                  </ProductSubtotal>
                </ProductControls>
              </Product>
            ))}
          </Products>
          <TotalContainer>
            <TotalText accessibilityLabel={`O total da compra está ${total}`}>
              TOTAL
            </TotalText>
            <TotalAmount accessibilityLabel={`O total da compra está ${total}`}>
              {total}
            </TotalAmount>
            <Order>
              <OrderText
                accessibilityLabel={`Finalizar a compra mp valor de ${total}`}
                accessibilityHint="Clique duas vezes para finalizar a compra"
              >
                FINALIZAR PEDIDO
              </OrderText>
            </Order>
          </TotalContainer>
        </>
      ) : (
        <EmptyContainer>
          <Icon name="remove-shopping-cart" size={64} color="#eee" />
          <EmptyText>Seu carrinho está vazio.</EmptyText>
        </EmptyContainer>
      )}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  products: state.cart.map((product) => ({
    ...product,
    subtotal: formatPrice(product.price * product.amount),
    priceFormatted: formatPrice(product.price),
  })),
  total: formatPrice(
    state.cart.reduce(
      (total, product) => total + product.price * product.amount,
      0
    )
  ),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(CartActions, dispatch);

Cart.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape).isRequired,
  total: PropTypes.string.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateAmountRequest: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

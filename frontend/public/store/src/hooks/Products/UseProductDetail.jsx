import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/api";

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/products/public/${productId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Producto no encontrado");
          throw new Error("Error al cargar el producto");
        }
        const data = await res.json();
        const { variants: v, related: r, ...productData } = data;
        setProduct(productData);
        setVariants(v || []);
        setRelated(r || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Calcular precio mínimo de variantes activas
  const getMinPrice = () => {
    const active = variants.filter((v) => v.status && v.stock > 0);
    if (active.length === 0) return null;
    return Math.min(...active.map((v) => v.price));
  };

  // Aplicar descuento
  const getFinalPrice = (price) => {
    if (!product?.discount?.active || !product?.discount?.percentage) return price;
    return price - (price * product.discount.percentage) / 100;
  };

  // Obtener atributos únicos de todas las variantes
  const getUniqueAttributes = () => {
    const attrsMap = {};
    variants.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        const attrName = attr.idAttribute?.name;
        const attrId = attr.idAttribute?._id;
        if (!attrName || !attrId) return;
        if (!attrsMap[attrId]) {
          attrsMap[attrId] = { id: attrId, name: attrName, values: [] };
        }
        const valueExists = attrsMap[attrId].values.find(
          (v) => v.id === attr.idValue?._id
        );
        if (!valueExists && attr.idValue) {
          attrsMap[attrId].values.push({
            id: attr.idValue._id,
            value: attr.idValue.value,
          });
        }
      });
    });
    return Object.values(attrsMap);
  };

  // Encontrar variante que coincida con los atributos seleccionados
  const findMatchingVariant = (selectedAttrs) => {
    if (Object.keys(selectedAttrs).length === 0) return null;
    return variants.find((variant) => {
      return Object.entries(selectedAttrs).every(([attrId, valueId]) => {
        return variant.attributes?.some(
          (a) =>
            a.idAttribute?._id === attrId && a.idValue?._id === valueId
        );
      });
    });
  };

  return {
    product,
    variants,
    related,
    loading,
    error,
    getMinPrice,
    getFinalPrice,
    getUniqueAttributes,
    findMatchingVariant,
  };
};

export default useProductDetail;
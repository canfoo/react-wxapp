const vendorPrefixes = ['webkit', 'moz', 'ms', 'o'];

const transformReactStyleKey = (key) => {
  // css3 var
  if (key?.startsWith('--')) {
    return key;
  }

  let styleValue = key.replace(/\.?([A-Z]+)/g, function (_x, y) {
    return '-' + y.toLowerCase();
  });

  // vendor prefix
  if (styleValue?.startsWith('-')) {
    const firstWord = styleValue.split('-').filter(s => s)[0];
    styleValue = styleValue.replace(/^-/, '');

    if (find(vendorPrefixes, prefix => prefix === firstWord)) {
      styleValue = '-' + styleValue;
    }
  }

  return styleValue;
};

const transformPx = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\b(\d+(\.\d+)?)px\b/g, function (match, x) {
    const targetUnit = 'rpx';
    const size = Number(x);
    return size % 1 === 0 ? size + targetUnit : size.toFixed(2) + targetUnit;
  });
};

const plainStyle = (style) => {
  return Object.keys(style)
    .reduce((acc, key) => {
      let value = style[key];

      if (!Number.isNaN(Number(value)) && !isUnitlessNumber[key]) {
        value = value + 'rpx';
      }

      return [...acc, `${transformReactStyleKey(key)}:${value};`];
    }, [])
    .join('');
};

export function getAlias(prop, type) {
  const hostComponent = {};

  return hostComponent?.alias?.[prop] ?? prop;
}

function getValue(prop, value) {
  if (prop.toLowerCase().endsWith('style') && Object.prototype.toString.call(value) === '[object Object]') {
    return plainStyle(value);
  }

  return value;
}


export function propAlias(prop, value, type) {
  return [getAlias(prop, type), getValue(prop, value)];
}

export default function propsAlias(props, type) {
  if (!props) {
    return props;
  }

  const aliasProps = {};

  for (const prop in props) {
    const key = getAlias(prop, type);
    const value = getValue(prop, props[prop]);
    aliasProps[key] = aliasProps[key] || value;
  }

  return aliasProps;
}

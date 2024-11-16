import React from 'react'
import NumberFormat, { NumberFormatProps } from 'react-number-format';



interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value: string;
}
export const NumberFormatCustom = React.forwardRef<
  NumberFormatProps,
  CustomProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        if (values.value !== props.value)
          onChange({
            target: {
              name: props.name,
              value: values.value || '',
            },
          });
      }}
      thousandSeparator
      isNumericString
      // allowNegative={false}
    />
  );
});

export default NumberFormatCustom
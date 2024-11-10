import { Box, Button, IconButton, InputBase, Typography } from '@mui/material';
import NumberFormatCustom from './NumberFormatCustom';
import { XCircleIcon } from '@heroicons/react/solid';
import { ExternalTokenIcon } from '@/components/primitives/TokenIcon';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import { TokenInfo } from '@/ui-config/TokenList';
export interface TokenInfoWithBalance extends TokenInfo {
  balance: string;
  oracle?: string;
}

interface AssetInputProps {
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  disableInput?: boolean;
  maxValue?: string;
  selectedAsset: TokenInfoWithBalance;
}

const SwitchAssetInput = ({
  value,
  onChange,
  disabled,
  maxValue,
  disableInput,
}: AssetInputProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  return (
    <Box
      sx={(theme) => ({
        p: '8px 12px',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '6px',
        width: '100%',
        mb: 1,
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <InputBase
          sx={{ flex: 1 }}
          placeholder="0.00"
          autoFocus
          disabled={disabled || disableInput}
          onChange={(e) => {
            if (!onChange) return;
            if (Number(e.target.value) > Number(maxValue)) {
              onChange('-1');
            } else {
              onChange(e.target.value);
            }
          }}
          inputProps={{
            'aria-label': 'amount input',
            style: {
              fontSize: '21px',
              lineHeight: '28,01px',
              padding: 0,
              height: '28px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            },
          }}
          // eslint-disable-next-line
          inputComponent={NumberFormatCustom as any}
        />
        {value !== '' && !disableInput && (
          <IconButton
            sx={{
              minWidth: 0,
              p: 0,
              left: 8,
              zIndex: 1,
              color: 'text.muted',
              '&:hover': {
                color: 'text.secondary',
              },
            }}
            onClick={() => {
              onChange && onChange('');
            }}
            disabled={disabled}
          >
            <XCircleIcon height={16} />
          </IconButton>
        )}
        <Button
          disableRipple
          data-cy={`assetSelect`}
          sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          <ExternalTokenIcon
            symbol={'default'}
            // logoURI={selectedAsset.logoURI}
            sx={{ mr: 2, ml: 3 }}
          />
          <Typography
            // data-cy={`assetsSelectedOption_${selectedAsset.symbol.toUpperCase()}`}
            variant="main16"
            color="text.primary"
          >
            ETH
            {/* {selectedAsset.symbol} */}
          </Typography>
        </Button>
        
      </Box>
    </Box>
  );
};

export default SwitchAssetInput;

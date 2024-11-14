import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import NumberFormatCustom from './NumberFormatCustom';
import { XCircleIcon } from '@heroicons/react/solid';
import { ExternalTokenIcon } from '@/components/primitives/TokenIcon';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { TokenInfo } from '@/ui-config/TokenList';
import { COINLISTS, COMMON_SWAPS } from '@/constants';
import { CoinListTypes, TokenInfoTypes } from '@/types';
export interface TokenInfoWithBalance extends TokenInfo {
  balance: string;
  oracle?: string;
}

interface AssetInputProps {
  value: string;
  chainId: number;
  disabled?: boolean;
  disableInput?: boolean;
  maxValue?: string;
  assets: TokenInfoTypes[];
  selectedAsset: TokenInfoTypes;
  onSelect?: (asset: TokenInfoTypes) => void;
  onChange?: (value: string) => void;
}

const SwitchAssetInput = ({
  value,
  assets,
  chainId,
  disabled,
  maxValue,
  disableInput,
  selectedAsset,
  onChange,
  onSelect,
}: AssetInputProps) => {
  const theme = useTheme();
  const popularAssets = assets?.filter((item) =>
    COMMON_SWAPS.includes(item.symbol),
  );
  const inputRef = useRef<HTMLDivElement>(null);
  const [loadingNewAsset, setLoadingNewAsset] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // select asset
  const handleSelect = (asset: TokenInfoTypes) => {
    onSelect?.(asset);
    onChange?.('');
    handleClose();
  };

  return (
    <Box
      ref={inputRef}
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
          value={value}
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
          onClick={() => setAnchorEl(inputRef.current)}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          <ExternalTokenIcon
            symbol={selectedAsset?.symbol}
            logoURI={selectedAsset?.logoURI || COINLISTS[0]?.logoURI}
            sx={{ mr: 2, ml: 3 }}
          />
          <Typography
            data-cy={`assetsSelectedOption_${selectedAsset.symbol.toUpperCase()}`}
            variant="main16"
            color="text.primary"
          >
            {selectedAsset?.symbol || ''}
          </Typography>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: inputRef.current?.offsetWidth,
              border:
                theme.palette.mode === 'dark' ? '1px solid #EBEBED1F' : 'unset',
              boxShadow: '0px 2px 10px 0px #0000001A',
              overflow: 'hidden',
            },
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box
            sx={(theme) => ({
              p: 2,
              px: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              top: 0,
              zIndex: 2,
              backgroundColor: '#292e41',
            })}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                overfloyY: 'auto',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                mt: 2,
                gap: 2,
              }}
            >
              {popularAssets?.map((asset) => (
                <Box
                  key={asset.symbol}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.divider,
                    },
                  }}
                  onClick={() => handleSelect(asset)}
                >
                  <ExternalTokenIcon
                    logoURI={asset.logoURI}
                    symbol={asset.symbol}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography
                    variant="main14"
                    color="text.primary"
                    sx={{ mr: 1 }}
                  >
                    {asset.symbol}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ overflow: 'auto', maxHeight: '200px' }}>
            {loadingNewAsset ? (
              <Box
                sx={{
                  maxHeight: '178px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '60px',
                }}
              >
                <CircularProgress sx={{ mx: 'auto', my: 'auto' }} />
              </Box>
            ) : assets.length > 0 ? (
              assets.map((asset) => (
                <MenuItem
                  key={asset.symbol}
                  value={asset.symbol}
                  data-cy={`assetsSelectOption_${asset.symbol?.toUpperCase()}`}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                  }}
                  onClick={() => handleSelect(asset)}
                >
                  <ExternalTokenIcon
                    symbol={asset.symbol}
                    logoURI={asset.logoURI}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText sx={{ flexGrow: 0 }}>
                    {asset.symbol}
                  </ListItemText>
                </MenuItem>
              ))
            ) : (
              <Typography
                variant="main14"
                color="text.primary"
                sx={{ width: 'auto', textAlign: 'center', m: 4 }}
              >
                <Trans>
                  No results found. You can import a custom token with a
                  contract address
                </Trans>
              </Typography>
            )}
          </Box>
        </Menu>
      </Box>
    </Box>
  );
};

export default SwitchAssetInput;

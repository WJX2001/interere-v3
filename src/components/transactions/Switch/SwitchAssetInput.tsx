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
import { useRef, useState } from 'react';
import { TokenInfo } from '@/ui-config/TokenList';
import { COINLISTS, COMMON_SWAPS } from '@/constants';
import { CoinListTypes } from '@/types';
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
  loading?: boolean;
  assets: CoinListTypes[];
  selectedAsset: CoinListTypes;
  isMaxSelected?: boolean;
  disableSelectToken?: boolean;
  onSelect?: (asset: CoinListTypes) => void;
  onChange?: (value: string) => void;
}

const SwitchAssetInput = ({
  value,
  assets,
  disabled,
  maxValue,
  disableInput,
  selectedAsset,
  loading = false,
  disableSelectToken = false,
  onChange,
  onSelect,
}: AssetInputProps) => {
  const theme = useTheme();
  const popularAssets = assets?.filter((item) =>
    COMMON_SWAPS.includes(item.symbol),
  );
  const inputRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // select asset
  const handleSelect = (asset: CoinListTypes) => {
    onSelect?.(asset);
    onChange?.('');
    handleClose();
  };

  // Turns the account's balance into something nice and readable
  const formatBalance = (balance: string, symbol: string) => {
    if (balance && symbol) return parseFloat(balance).toPrecision(8);
    else return '0.0';
  };

  return (
    <>
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
          {loading ? (
            <Box sx={{ flex: 1 }}>
              <CircularProgress color="inherit" size="16px" />
            </Box>
          ) : (
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
          )}
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
                // onChange && onChange('');
                if (onChange) {
                  onChange('');
                }
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
            disabled={disableSelectToken}
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
                  theme.palette.mode === 'dark'
                    ? '1px solid #EBEBED1F'
                    : 'unset',
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
              {assets.length > 0 ? (
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
                  No results found. You can import a custom token with a
                  contract address
                </Typography>
              )}
            </Box>
          </Menu>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '16px',
            flexDirection: 'row-reverse',
          }}
        >
          {onChange && selectedAsset.balance ? (
            <>
              {!disableInput && (
                <Button
                  size="small"
                  sx={{ minWidth: 0, ml: '7px', p: 0 }}
                  onClick={() => {
                    onChange('-1');
                  }}
                  disabled={disabled}
                >
                  Max
                </Button>
              )}
            </>
          ) : (
            ''
          )}
          {selectedAsset.balance != null ? (
            <Typography
              component="div"
              variant="secondary12"
              color="text.secondary"
            >
              <span>Balance </span>
              {formatBalance(selectedAsset.balance, selectedAsset.symbol)}
            </Typography>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </>
  );
};

export default SwitchAssetInput;

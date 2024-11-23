
import { CogIcon } from '@heroicons/react/solid';
import { Button, SvgIcon } from '@mui/material';
const SettingsMenu = () => {
  return (
    <div>
      <Button
        // @ts-expect-error TODO fix ts error
        variant="surface"
        sx={{ p: '7px 8px', minWidth: 'unset', ml: 2 }}
      >
        <SvgIcon sx={{ color: '#F1F1F3' }} fontSize="small">
          <CogIcon />
        </SvgIcon>
      </Button>
    </div>
  )
}

export default SettingsMenu
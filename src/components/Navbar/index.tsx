import { FC } from 'react'
import { Flex, Box } from '@ironfish/ui-kit'
import { SettingsIcon } from '@chakra-ui/icons'

import IconHome from 'Svgx/home'
import IconSend from 'Svgx/send'
import IconReceive from 'Svgx/receive'
import IconAddressBook from 'Svgx/address-book'
import IconNode from 'Svgx/node'
import Toggle from 'Components/ThemeToggle'
// import IconResources from 'Svgx/lightbulb'
// import IconMiner from 'Svgx/hammer'

import Nav from './Nav'
import IronFishLogo from 'Svgx/IronFishLogo'
import HexFishLogo from 'Svgx/hexfish'

import ActiveStatus from './ActiveStatus'
import ROUTES from 'Routes/data'

const primaryNavItems = [
  {
    hotkey: 'A',
    to: ROUTES.ACCOUNTS,
    label: 'Privacy Accounts',
    icon: IconHome,
  },
  { hotkey: 'S', to: ROUTES.SEND, label: 'Send $IRON', icon: IconSend },
  {
    hotkey: 'R',
    to: ROUTES.RECEIVE,
    label: 'Receive $IRON',
    icon: IconReceive,
  },
  {
    hotkey: 'B',
    to: ROUTES.ADDRESS_BOOK,
    label: 'Address Book',
    icon: IconAddressBook,
  },
  { hotkey: 'N', to: ROUTES.NODE, label: 'Your Node', icon: IconNode },
]
const secondaryNavItems = [
  // { hotkey: 'I', to: '/resources', label: 'Resources', icon: IconResources },
  // { hotkey: 'M', to: '/miner', label: 'Miner', icon: IconMiner },
]
interface NavbarProps {
  offsetTop?: number
}

export const Navbar: FC<NavbarProps> = ({ offsetTop = 0 }) => {
  return (
    <Flex
      bg="inherit"
      height="100%"
      maxHeight="100vh"
      p="3rem 1rem 1rem"
      pt={`${3 + offsetTop}rem`}
      w={{ base: '5.5rem', sm: '16.4375rem' }}
      transition="width 0.3s ease-in-out, padding 0.3s ease-in-out"
      position="fixed"
      left="0"
      top="0"
      flexDirection="column"
      alignItems="start"
      zIndex={100}
    >
      <IronFishLogo
        m="0.5rem 1rem"
        display={{ base: 'none', sm: 'inline-block' }}
      />
      <HexFishLogo
        m="0.5rem 1rem"
        display={{ base: 'inline-block', sm: 'none' }}
      />
      <Box mt="2rem">
        <Nav list={primaryNavItems} />
      </Box>
      <Box marginTop="auto">
        <ActiveStatus />
        <Toggle />
      </Box>
    </Flex>
  )
}

export default Navbar

import { useSettings } from '../context/SettingsContext';

const Logo = () => {
    const { settings } = useSettings();
    const logoSrc = settings?.theme === 'light' ? '/logo-light.svg' : '/logo-dark.svg';

    return (
        <img src={logoSrc} alt="Logo" width="140" />
    );
};

export default Logo;
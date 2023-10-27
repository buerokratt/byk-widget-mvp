import { useAppSelector } from '../store';
import { AuthenticationState } from '../slices/authentication-slice';

const useAuthenticationSelector = (): AuthenticationState => ({ ...useAppSelector(({ authentication }) => authentication) });

export default useAuthenticationSelector;

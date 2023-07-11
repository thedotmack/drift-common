import { singletonHook } from 'react-singleton-hook';
import { useLocalStorage } from 'react-use';

/**
 * Returns the dev switch state and a function to toggle it.
 */
const useDevSwitchIsOn = singletonHook(
	{ devSwitchIsOn: false, toggleDevSwitch: () => {} },
	() => {
		const [devSwitchIsOn, setDevSwitchIsOn] = useLocalStorage<boolean>(
			'devswitch',
			false,
			{
				raw: false,
				serializer: JSON.stringify,
				deserializer: JSON.parse,
			}
		);

		const toggleDevSwitch = () => {
			setDevSwitchIsOn(devSwitchIsOn);
		};

		return { devSwitchIsOn, toggleDevSwitch };
	}
);

export default useDevSwitchIsOn;
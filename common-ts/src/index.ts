import {
	SpotMarketConfig,
	DriftEnv,
	initialize,
	PerpMarketConfig,
} from '@drift-labs/sdk';

export * from './chartConstants';
export * from './utils/candleUtils';
export * from './types';
export * from './EnvironmentConstants';
export * from './utils';
export * from './utils/index';
export * from './utils/s3Buckets';
export * from './serializableTypes';
export * from './utils/Candle';
export * from './utils/featureFlags';
export * from './utils/WalletConnectionState';
export * from './utils/rpcLatency';
export * from './utils/token';
export * from './common-ui-utils/commonUiUtils';

export const Config: {
	initialized: boolean;
	spotMarkets: SpotMarketConfig[];
	perpMarkets: PerpMarketConfig[];
	sdkConfig: ReturnType<typeof initialize>;
} = {
	initialized: false,
	spotMarkets: [],
	perpMarkets: [],
	sdkConfig: undefined,
};

const spotMarketsLookup: { current: SpotMarketConfig[]; initialized: boolean } =
	{
		current: [],
		initialized: false,
	};

const perpMarketsLookup: { current: PerpMarketConfig[]; initialized: boolean } =
	{
		current: [],
		initialized: false,
	};

export const Initialize = (env: DriftEnv) => {
	const config = initialize({ env });

	const maxSpotMarketIndex = Math.max(
		...config.SPOT_MARKETS.map((market) => market.marketIndex)
	);

	const maxPerpMarketIndex = Math.max(
		...config.PERP_MARKETS.map((market) => market.marketIndex)
	);

	const spotMarkets = new Array(maxSpotMarketIndex);
	const markets = new Array(maxPerpMarketIndex);

	config.SPOT_MARKETS.forEach((spotMarket) => {
		spotMarkets[spotMarket.marketIndex] = spotMarket;
	});

	config.PERP_MARKETS.forEach((perpMarket) => {
		markets[perpMarket.marketIndex] = perpMarket;
	});

	Config.spotMarkets = spotMarkets;
	Config.perpMarkets = markets;

	Config.initialized = true;
};

/**
 * Get an array of banks where the bank's position in the array is the same as the bank's index
 * @returns
 */
export const GetBanksLookup = () => {
	if (!Config.initialized) throw 'Need to call Initialze on common first';

	if (!spotMarketsLookup.initialized) {
		const spotMarkets = Config.spotMarkets;

		const maxBankIndex = spotMarkets.reduce((previousMax, currentValue) => {
			const currentValueNumber = currentValue.marketIndex;
			return previousMax > currentValueNumber
				? previousMax
				: currentValueNumber;
		}, 0);

		spotMarketsLookup.current = new Array(maxBankIndex);

		spotMarkets.map((bank) => {
			spotMarketsLookup.current[bank.marketIndex] = bank;
		});

		spotMarketsLookup.initialized = true;
	}

	return [...spotMarketsLookup.current];
};

/**
 * Get an array of markets where the market's position in the array is the same as the market's index
 * @returns
 */
export const GetMarketsLookup = () => {
	if (!Config.initialized) throw 'Need to call Initialze on common first';

	if (!perpMarketsLookup.initialized) {
		const perpMarkets = Config.perpMarkets;

		const maxBankIndex = perpMarkets.reduce((previousMax, currentValue) => {
			const currentValueNumber = currentValue.marketIndex;
			return previousMax > currentValueNumber
				? previousMax
				: currentValueNumber;
		}, 0);

		perpMarketsLookup.current = new Array(maxBankIndex);

		perpMarkets.forEach((bank) => {
			perpMarketsLookup.current[bank.marketIndex] = bank;
		});

		perpMarketsLookup.initialized = true;
	}

	return [...perpMarketsLookup.current];
};
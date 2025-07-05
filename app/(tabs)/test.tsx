import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { BackHandler } from 'react-native';

type WebViewPages = {
	url: string;
	params?: Record<string, string>;
}

export default function test() {
	const webViewRef = useRef<WebView>(null);
	const [webviewStack, setWebviewStack] = useState<WebViewPages[]>([
		{
			url: 'https://lucie0417.github.io/react-webview-test/?t=${Date.now()'
		}
	]);
	const [currentUrl, setCurrentUrl] = useState<string>(
		'https://lucie0417.github.io/react-webview-test/'
	);

	useEffect(() => {
		const backAction = () => {
			if (webviewStack.length > 1) {
				const newStack = [...webviewStack];
				newStack.pop();
				const lastPage = newStack[newStack.length - 1];
				const url = buildUrlWithParams(lastPage.url, lastPage.params);

				setWebviewStack(newStack);
				setCurrentUrl(url);
				return true;
			}
			return false; // 退出APP
		};

		// 監聽 Android 返回鍵事件
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, [webviewStack]);

	// 加入頁面堆疊 + 切換 Webview
	const pushWebviewPage = (newPage: WebViewPages) => {
		const urlWithParams = buildUrlWithParams(newPage.url, newPage.params);
		setWebviewStack((prev) => [...prev, newPage]);
		setCurrentUrl(urlWithParams);
	};

	// 組合網址
	const buildUrlWithParams = (
		baseUrl: string,
		params?: Record<string, string>
	): string => {
		if (!params) return baseUrl;
		const query = new URLSearchParams(params).toString();
		return `${baseUrl}?${query}`;
	};

	// 接收APP Message
	const handleMessage = (e: WebViewMessageEvent) => {
		const message = e.nativeEvent.data;
		console.log('Message received!', JSON.stringify(message));

		if (message === 'toAngularProject') {
			pushWebviewPage({
				url: 'https://e68.tw/circulated/circulatedDetail',
				params: {
					id: '1163898'
				}
			});
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>
				<WebView
					ref={webViewRef}
					originWhitelist={['*']}
					onMessage={handleMessage}
					source={{ uri: currentUrl }}
					cacheEnabled={false}
					cacheMode='LOAD_NO_CACHE'
					style={styles.webview}
				/>
			</View>
		</SafeAreaView>);

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	webview: {
		flex: 1,
	},
	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		color: '#BF3131',
		fontSize: 18,
	},
});
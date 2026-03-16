using Microsoft.Maui.Controls;
using System;

namespace QwertyClient
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
            ConfigureWebView();
        }

        private void ConfigureWebView()
        {
            // 配置WebView的基本设置
            webView.Navigating += (sender, e) =>
            {
                // 可以在这里添加导航拦截逻辑
            };
        }
    }
}

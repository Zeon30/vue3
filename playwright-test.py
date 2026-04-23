from playwright.sync_api import sync_playwright

def main():
    # 1. 初始化 Playwright 并启动浏览器（默认无头模式，可设 headless=False 可视化）
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # 设为 False 可看到浏览器操作过程
        context = browser.new_context()
        page = context.new_page()

        try:
            # 2. 打开百度首页
            page.goto("https://www.baidu.com")
            
            # 3. 定位搜索框并输入关键词（通过 id 定位，百度搜索框 id="kw"）
            search_box = page.locator("#kw")
            search_box.fill("欧冶云商")
            
            # 4. 点击搜索按钮（百度搜索按钮 id="su"）
            page.locator("#su").click()
            
            # 5. 等待搜索结果加载并点击第一个链接
            # 定位搜索结果列表的第一个标题链接（百度结果通常在 #content_left 下的 h3 中）
            first_result = page.locator("#content_left h3 a").first
            first_result.wait_for(state="visible")  # 确保元素可见
            first_result.click()
            
            # 6. 等待新页面加载完成（等待网络空闲，确保资源加载完毕）
            page.wait_for_load_state("networkidle")
            
            # 7. 截图并保存（保存到当前目录，文件名可自定义）
            screenshot_path = "ouyeel_screenshot.png"
            page.screenshot(path=screenshot_path, full_page=True)  # full_page=True 截取整个页面
            print(f"截图已保存至: {screenshot_path}")

        except Exception as e:
            print(f"发生错误: {e}")
        finally:
            # 8. 关闭浏览器
            browser.close()

if __name__ == "__main__":
    main()




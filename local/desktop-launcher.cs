using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;
using System.Windows.Forms;

internal static class LifeAtlasDesktop
{
    [STAThread]
    private static int Main(string[] args)
    {
        string folder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        string action = args.Length == 0 ? "open" : args[0];
        if (action != "open" && action != "start" && action != "stop" && action != "backup")
            return 2;
        try
        {
            string node = Path.Combine(folder, "runtime", "node.exe");
            string launcher = Path.Combine(folder, "runtime", "launcher.mjs");
            if (!File.Exists(node) || !File.Exists(launcher))
                throw new FileNotFoundException("程序文件不完整，请重新解压程序包；个人资料文件夹无需删除。");
            var info = new ProcessStartInfo(node, "\"" + launcher + "\" " + action);
            info.WorkingDirectory = folder;
            info.UseShellExecute = false;
            info.CreateNoWindow = true;
            info.RedirectStandardOutput = true;
            info.RedirectStandardError = true;
            info.StandardOutputEncoding = Encoding.UTF8;
            info.StandardErrorEncoding = Encoding.UTF8;
            var error = new StringBuilder();
            using (var process = new Process())
            {
                process.StartInfo = info;
                process.OutputDataReceived += delegate(object sender, DataReceivedEventArgs e) { };
                process.ErrorDataReceived += delegate(object sender, DataReceivedEventArgs e) { if (e.Data != null) error.AppendLine(e.Data); };
                process.Start();
                process.BeginOutputReadLine();
                process.BeginErrorReadLine();
                process.WaitForExit();
                if (process.ExitCode != 0)
                    throw new InvalidOperationException("启动或操作未完成。请查看资料目录中的 application.log。\n\n" + error.ToString());
            }
            if (action == "backup")
                MessageBox.Show("完整备份已保存到资料文件夹中的 backups 目录。", "LifeAtlas", MessageBoxButtons.OK, MessageBoxIcon.Information);
            return 0;
        }
        catch (Exception error)
        {
            MessageBox.Show(error.Message, "LifeAtlas", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return 1;
        }
    }
}

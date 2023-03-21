import { spawn } from "child_process";

export default function CallPythonScript() {
    const pythonProcess = spawn("python", [
        "path/to/python/script.py",
        "arg1",
        "arg2",
    ]);

    pythonProcess.stdout.on("data", (data) => {
        // Handle the output from the Python script
        console.log(data);
    });

    pythonProcess.stderr.on("data", (data) => {
        // Handle any error output from the Python script
        console.log(data);
    });
}

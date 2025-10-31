import { SerialPort } from "serialport";

var kantSerial = "85033313137351B09081";
var socratesSerial = "5503731303735140B0A2";
var kantPort = undefined;
var socratesPort = undefined;
var baudRate = 9600;
var ports = await SerialPort.list();

for(var { path, serialNumber } of ports){
	if(serialNumber == kantSerial) kantPort = new SerialPort({ path, baudRate });
	if(serialNumber == socratesSerial) socratesPort = new SerialPort({ path, baudRate });
}

var set = {
	kant(to){ kantPort && kantPort.write(to.toString()[0]) },
	socrates(to){ socratesPort && socratesPort.write(to.toString()[0]) }
}

export default function setBot(to, person){
	if(!person) return ["kant", "socrates"].forEach((person) => set[person](to));
	set[person](to);
}
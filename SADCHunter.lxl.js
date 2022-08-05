var Version = "v1.0"
var configVersion = "v1.0"
//配置文件文件夹生成
let DefaultLang = {
	"Get_Money": "§2击杀奖励§6{num}§2{money_name}",
	"Lang_Error": "读取语言文件出错！",
	"Cannot_Get_Money": "§b您在§e1小时§b内无法再从此生物中获取{money_name}!",
	"Debug_Killed": "§b[SADCHunter]您杀死了§e{mob_name}",
	"Config_Error": "您的config.json配置异常，已重置",
	"Config_Error_2": "您的mobs.json配置异常，已重置",
	"Update_config": "检测到配置文件非{configVersion}的版本，已重置配置项",
	"Get_NewVersion": "获取到云端版本{version_lastest}，正在更新...",
	"Get_NewVersion_Error": "获取最新版本异常",
	"UpdatePlugin_Successful": "自动更新成功",
	"UpdatePlugin_Error": "自动更新异常",
	"DegbugCommandText": "获取杀死怪物的标准类型名",
	"Debug_Open": "§b[SADCHunter]您打开了此功能",
	"Debug_Close": "§b[SADCHunter]您关闭了此功能",
	"Debug_Help": "§b[SADCHunter]提示\n/getmobid true-打开获取怪物类型名功能\n/getmobid false-关闭获取怪物类型名功能"
}
function read() {
	let r = file.createDir('plugins/SADCHunter')
	//配置文件生成
	let deploy = file.exists('plugins/SADCHunter/config.json');
	if (deploy) {
		try {
			tick = file.readFrom('plugins\\SADCHunter\\config.json');
			traab = JSON.parse(tick);
		}
		catch (err) {
			log(DefaultLang.Config_Error)
			setconfig()
			tick = file.readFrom('plugins\\SADCHunter\\config.json');
			traab = JSON.parse(tick);
		}
	}
	else {
		setconfig()
		tick = file.readFrom('plugins\\SADCHunter\\config.json');
		traab = JSON.parse(tick);
	}
	if (file.exists('plugins/SADCHunter/lang/' + traab["语言(language)"] + '.json')) {
		try {
			langraw = file.readFrom('plugins/SADCHunter/lang/' + traab["语言(language)"] + '.json');
			lang = JSON.parse(langraw);
		}
		catch(err){
			log("读取语言文件出错！")
			lang = DefaultLang
		}
	}
	else {
		lang = DefaultLang
		setLang()
	}
	if (File.exists('plugins\\SADCHunter\\mobs.json') == false) {
		setconfig2()
	}
}
read()
function setconfig() {
	let dataccq = { "配置文件版本号": configVersion, "自动更新": true, "语言(language)": "zh_cn", "经济类型(请选择score或llmoney)": "score", "记分板名称": "money", "是否注册获取生物ID命令": false, "货币名称": "金币", "是否开启限制刷怪塔机制": true, "限制数量": "20" };
	let datacaa = JSON.stringify(dataccq, null, "\t");
	file.writeTo('plugins\\SADCHunter\\config.json', datacaa);
}
function setconfig2() {
	let data2 = { "minecraft:zombie": "1", "minecraft:skeleton": "1", "minecraft:spider": "1", "minecraft:blaze": "1", "minecraft:creeper": "1", "minecraft:drowned": "1", "minecraft:elder_guardian": "1", "minecraft:enderman": "1", "minecraft:endermite": "1", "minecraft:evocation_illager": "1", "minecraft:ghast": "1", "minecraft:guardian": "1", "minecraft:hoglin": "1", "minecraft:husk": "1", "minecraft:magma_cube": "1", "minecraft:pillager": "1", "minecraft:ravager": "1", "minecraft:shulker": "1", "minecraft:silverfish": "1", "minecraft:skeleton_horse": "1", "minecraft:slime": "1", "minecraft:stray": "1", "minecraft:vex": "1", "minecraft:vindicator": "1", "minecraft:witch": "1", "minecraft:wither_skeleton": "1", "minecraft:zoglin": "1", "minecraft:zombie_villager_v2": "1", "minecraft:piglin_brute": "1", "minecraft:piglin": "1", "minecraft:cave_spider": "1", "minecraft:zombie_pigman": "1", "minecraft:phantom": "1", "minecraft:ender_dragon": "1", "minecraft:wither": "1", "minecraft:goat": "1", "minecraft:axolotl": "1", "minecraft:glow_squid": "1" }
	let data1 = JSON.stringify(data2, null, "\t");
	file.writeTo('plugins\\SADCHunter\\mobs.json', data1)
}
function setLang() {
	let rawlang = JSON.stringify(DefaultLang, null, "\t");
	file.writeTo('plugins\\SADCHunter\\lang\\zh_cn.json', rawlang);
}
if (traab["配置文件版本号"] != configVersion) {
	setconfig()
	setTimeout(function () {
		log(lang.Update_config.replace("{configVersion}", configVersion))
	}, 8000)
	read()
}
if (traab["自动更新"] == true) {
	network.httpGet('https://gitee.com/sheepxray/sadchunter/blob/master/version.json', function (st, dat) {
		if (st == 200) {
			let version_lastest = JSON.parse(dat).version
			if (version_lastest != Version) {
				log(lang.Get_NewVersion.replace("{version_lastest}", version_lastest))
				network.httpGet('https://gitee.com/sheepxray/sadchunter/blob/master/SADCHunter.lxl.js', function (st2, dat2) {
					if (st2 == 200) {
						let plugin = dat2.replace(/\r/g, '');
						file.writeTo("plugins/SADCHunter.js", plugin)
						log(lang.UpdatePlugin_Successful)
						mc.runcmdEx("lxl reload SADCHunter.js")
					}
					else {
						log(lang.UpdatePlugin_Error)
					}
				})
			}
		}
		else {
			log(lang.Get_NewVersion_Error)
		}
	})
}
var time = {}
var getid = {}
//监听击杀事件
mc.listen("onMobDie", function (mob, source) {
	if (source != undefined) {
		var srcname = source.name
		var mobtype = mob.type
		var srctype = source.type
		hunter(srcname, mobtype, srctype, source)
	}
});
var list
try {
	list = JSON.parse(File.readFrom('plugins\\SADCHunter\\mobs.json'));
}
catch (err) {
	log(lang.Config_Error_2)
	setconfig2()
	list = JSON.parse(File.readFrom('plugins\\SADCHunter\\mobs.json'));
}

function reset(key, srcname) {
	setTimeout(function () { time[key][srcname] = 0 }, 3600 * 1000);
}
function hunter(srcname, mobtype, srctype, source) {
	if (srctype == "minecraft:player") {
		let source2 = source.toPlayer()
		if (getid[source2.name] == 1) {
			source2.tell(lang.Debug_Killed.replace("{mob_name}", mobtype))
		}
		for (key in list) {
			if (key == mobtype) {
				if (traab["是否开启限制刷怪塔机制"] == true) {
					if (time[key] == undefined) {
						time[key] = {};
					}
					if (time[key][srcname] == undefined || time[key][srcname] == 0) {
						time[key][srcname] = 0
						reset(key, srcname)

					}
					if (time[key][srcname] <= traab["限制数量"]) {
						if (traab["经济类型(请选择score或llmoney)"] == 'score') {
							source2.addScore(String(traab["记分板名称"]), Number(list[key]))
						}
						else {
							money.add(source2.xuid, Number(list[key]))
						}
						source2.tell(lang.Get_Money
							.replace("{num}", list[key])
							.replace("{money_name}", traab["货币名称"])
							, 5)
							log(lang.Get_Money
								.replace("{num}", list[key])
								.replace("{money_name}", traab["货币名称"])
								)
						time[key][srcname] += 1;
					}
					else if (time[key][srcname] >= traab["限制数量"]) {
						mc.runcmdEx('title "' + srcname + '" actionbar §b您在§e1小时§b内无法再从此生物中获取' + traab["货币名称"] + '!')
						source2.tell(lang.Cannot_Get_Money.replace("money_name", traab["货币名称"]), 9)
					}
				}
				else {
					if (traab["经济类型(请选择score或llmoney)"] == 'score') {
						source2.addScore(String(traab["记分板名称"]), Number(list[key]))
					}
					else {
						money.add(source2.xuid, Number(list[key]))
					}
					source2.tell(lang.Get_Money
						.replace("{num}", list[key])
						.replace("{money_name}", traab["货币名称"])
						, 5)
				}
			}
		}
	}
}

//杂项
if (traab["是否注册获取生物ID命令"] == true) {
	mc.regPlayerCmd('getmobid', lang.DegbugCommandText, function (player, arg) {
		if (arg == 'true') {
			player.tell(lang.Debug_Open)
			getid[player.name] = 1
		}
		else if (arg == 'false') {
			getid[player.name] = 1
			player.tell(lang.Debug_Close)
		}
		else {
			player.tell(lang.Debug_Help)
		}
	}, 1)
}

setTimeout(function () {
	//提醒1
	log('[SADCHunter] >>作者：shwx52，版本：' + Version);
	log('[SADCHunter] >>鸣谢：flyMarcus233、huohua、清漪花开');
}, 7500);
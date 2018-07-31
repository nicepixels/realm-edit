#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

class RealmEdit {
    constructor() {
        this.application = new Gtk.Application();
        this.application.connect('activate', this._onActivate.bind(this));
        this.application.connect('startup', this._onStartup.bind(this));
    }

    _onActivate() {
        this._window.present();
    }

    _onStartup() {

        let builder = new Gtk.Builder();
        builder.add_from_file('interface.glade');

        // Header
        let headerBar = builder.get_object("headerBar")
        headerBar.set_title("Realm Edit");
        headerBar.set_subtitle("Media");

        // Background Image
        let buttonBackground = builder.get_object("buttonBackground")

        // Networking Menus
        //builder.connect_signals(SignalsHandler());
        let menuNetworking = builder.get_object("menuNetworking")
        this._netMenu();
        menuNetworking.set_menu_model(this.netMenuModel);

        let menuDNS = builder.get_object("menuDNS")
        this._dnsMenu();
        menuDNS.set_menu_model(this.dnsMenuModel);

        // Switches
        let switchShared = builder.get_object("switchShared")
        switchShared.connect('notify::active', () => {
            this._toggleSwitch(switchShared)
        });

        let switchSound = builder.get_object("switchSound")
        switchSound.connect('notify::active', () => {
            this._toggleSwitch(switchSound)
        });

        let switchKVM = builder.get_object("switchKVM")
        switchKVM.connect('notify::active', () => {
            this._toggleSwitch(switchKVM)
        });

        let switchGPU = builder.get_object("switchGPU")
        switchGPU.connect('notify::active', () => {
            this._toggleSwitch(switchGPU)
        });

        let switchWayland = builder.get_object("switchWayland")
        switchWayland.connect('notify::active', () => {
            this._toggleSwitch(switchWayland)
        });

        let switchX11 = builder.get_object("switchX11")
        switchX11.connect('notify::active', () => {
            this._toggleSwitch(switchX11)
        });

        this._loadConfig(builder)

        // Open Window
        this._window = builder.get_object('windowEdit');
        this._window.set_icon_from_file("realm.png");
        this.application.add_window(this._window);
    }

    _netMenu() {

        let normalAction = new Gio.SimpleAction({ name: 'clear' });
        normalAction.connect('activate', () => { this._chooseNet(); });
        this.application.add_action(normalAction);

        let openvpnAction = new Gio.SimpleAction({ name: 'openvpn' });
        openvpnAction.connect('activate', () => { this._chooseNet(); });
        this.application.add_action(openvpnAction);

        let wireguardAction = new Gio.SimpleAction({ name: 'wireguard' });
        wireguardAction.connect('activate', () => { this._chooseNet(); });
        this.application.add_action(wireguardAction);

        let torAction = new Gio.SimpleAction({ name: 'tor' });
        torAction.connect('activate', () => { this._chooseNet(); });
        this.application.add_action(torAction);

        this.netMenuModel = new Gio.Menu();

        this.menuItemNone  = Gio.MenuItem.new("None", 'none');
        this.menuItemClear = Gio.MenuItem.new("Clearnet", 'clear');
        this.menuItemVPN   = Gio.MenuItem.new("OpenVPN", 'openvpn');
        this.menuItemWire  = Gio.MenuItem.new("Wireguard", 'wireguard');
        this.menuItemTor   = Gio.MenuItem.new("Tor", "tor");

        this.netMenuModel.append_item(this.menuItemNone);
        this.netMenuModel.append_item(this.menuItemClear);
        this.netMenuModel.append_item(this.menuItemVPN);
        this.netMenuModel.append_item(this.menuItemWire);
        this.netMenuModel.append_item(this.menuItemTor);
    }

    _dnsMenu() {

        let normalAction = new Gio.SimpleAction({ name: 'citadel' });
        normalAction.connect('activate', () => { this._chooseNet(); });
        this.application.add_action(normalAction);

        let openvpnAction = new Gio.SimpleAction({ name: 'realm' });
        openvpnAction.connect('activate', () => { this._chooseNet(); });
        this.application.add_action(openvpnAction);

        let wireguardAction = new Gio.SimpleAction({ name: 'wireguard' });
        wireguardAction.connect('activate', () => { this._chooseNet(); });
        this.application.add_action(wireguardAction);

        this.dnsMenuModel = new Gio.Menu();

        this.menuItemClear = Gio.MenuItem.new("Clearnet", 'clear');
        this.menuItemVPN   = Gio.MenuItem.new("OpenVPN", 'openvpn');
        this.menuItemWire  = Gio.MenuItem.new("Wireguard", 'wireguard');

        this.dnsMenuModel.append_item(this.menuItemClear);
        this.dnsMenuModel.append_item(this.menuItemVPN);
        this.dnsMenuModel.append_item(this.menuItemWire);
    }

    _loadConfig(builder) {

        let file = Gio.File.new_for_path('mock-realm.json');

        file.load_contents_async(null, (file, res) => {
            let contents;
            try {
                contents = file.load_contents_finish(res)[1].toString();
                this.info = JSON.parse(contents);
                if (typeof this.info['counter-read'] !== 'undefined') {
                    this.info['counter-read'] = this.info['counter-read'] + 1;
                }

                print(JSON.stringify(this.info))

                let name = builder.get_object("entryName")
                name.set_text(this.info['name'])
            } catch (e) {
                return;
            }
        });

    }

    _chooseNet() {
        print("Clicking _chooseNet triggered")
    }

    _renameRealm() {
        print("Renaming Realm")
        print("name: " + this._name.get_text())
    }

    _isEnabled() {
        print("Switch _isEnabled")
    }

    _toggleSwitch(thisSwitch) {
        if (thisSwitch.active)
            print("Enable: " + thisSwitch.name.replace('switch-', ''))
        else
            print("Disable: " + thisSwitch.name.replace('switch-', ''))
    }

};

let app = new RealmEdit();
app.application.run(ARGV);

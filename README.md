![front pic](https://media-exp1.licdn.com/dms/image/C4E1BAQEMT5lSuDrcow/company-background_10000/0?e=2159024400&v=beta&t=S6Z8EbaUn5iFIKD_zc3MuRzDJnsHSBowEo9g9e9t_1A)

[![Downloads](http://pepy.tech/badge/stronghold)](http://pepy.tech/count/stronghold)

`dirty_thirties` is the homework team consisting of Nele, Sarah & Jenny.

This README is created to share and publish our homework for Systems Development & Frameworks.

![second pic](https://www.smartsheet.com/sites/default/files/styles/full_width_desktop/public/IC-System-Development-Lifecycle.jpg?itok=gQIZveEV)

This pic gives a first impression on the topic we have to face this semester. 

The following text is a blackbox text that will be filled out soon.
To be continued ....

**Usage**
---

```
Usage: stronghold.py [OPTIONS]

  Securely configure your Mac.
  Developed by Aaron Lichtman -> (Github: alichtman)


Options:
  -lockdown  Set secure configuration without user interaction.
  -v         Display version and author information and exit.
  -help, -h  Show this message and exit.
```

**Installation Options**
---

1. Install with [`pip`](https://pypi.org/project/stronghold/)
    + `$ pip install stronghold`
    + `$ stronghold`

2. Download the `stronghold` binary from Releases tab.


**Configuration Options**
---

1. Firewall

    + Turn on Firewall?
        - This helps protect your Mac from being attacked over the internet.
    + Turn on logging?
        - If there IS an infection, logs are useful for determining the source.
    + Turn on stealth mode?
        - Your Mac will not respond to ICMP ping requests or connection attempts from closed TCP and UDP networks.

2. General System Protection

    + Enable Gatekeeper?
    	- Defend against malware by enforcing code signing and verifying downloaded applications before allowing them to run.
    + Prevent automatic software whitelisting?
        - Both built-in and downloaded software will require user approval for whitelisting.
    + Disable Captive Portal Assistant and force login through browser on untrusted networks?
        - Captive Portal Assistant could be triggered and direct you to a malicious site WITHOUT any user interaction.

**How to Contribute**
---

1. Clone repo and create a new branch: `$ git checkout https://github.com/alichtman/stronghold -b name_for_new_branch`.
2. Make changes and test
3. Submit Pull Request with comprehensive description of changes

**Acknowledgements**
---

+ [@shobrook](https://www.github.com/shobrook) for logo and UI design assistance.



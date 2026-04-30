# 🦞 Run an AI Agent for Free using $10 Monthly Google Credits

![OpenClaw on GCP Banner](openclaw_gcp.png)
*Host your own private AI assistant for $0.00 out-of-pocket.*

Google Cloud gives $10 in monthly free credits to many developer accounts. This guide shows you how to use those credits to run your own OpenClaw agent.

---

## **The "$10 Budget" Strategy**
Most cloud setups cost $20-$50 a month. You can hit the $10 target by using a schedule.

### **Why skip 24/7?**
Running this 24 hours a day costs about **$10.10/month**. That puts you just over the free credit limit.

### **The Schedule Benefit**
If you turn the agent off at night (10 PM to 9 AM), the total cost drops to **~$6.40/month**. This gives you a **$3.60 buffer** for heavy AI usage without getting a bill.

---

## Why this setup works

Hosting an AI agent on a tight budget requires a few clever architectural choices. First, we use **Spot Instances** instead of regular ones. These allow you to use Google's spare capacity at a massive 60-91% discount. While Google can technically reclaim the machine if a full-paying customer needs it, a quick 30-second restart every few days is a fair trade for saving over $100 a year.

The biggest challenge with Spot instances is the **IP address change**. Every time the machine restarts or wakes up from its nightly schedule, Google assigns it a new public address. This would normally break a traditional domain name and require a "Static IP" reservation. However, Google charges about $3.30 a month just to hold that address while the VM is off—which would eat over 30% of your total budget.

This is where **Tailscale & MagicDNS** come in. Tailscale creates a secure, private network between your devices, while its MagicDNS feature assigns your VM a permanent hostname (like `http://openclaw-agent`). This name never changes, even when the underlying IP does. By using this setup, you get a reliable, encrypted connection to your dashboard that is completely invisible to the public internet, all while keeping your costs at zero for networking and security.

---


## **Step 1: Set up Google Cloud Services**

### **1.1 Create a New Project**
Before you can start your agent, you need a "Project" to hold your resources.
1.  **Visit the Console:** Go to the [Google Cloud Resource Manager](https://console.cloud.google.com/projectcreate).
2.  **Fill in the Details:**
    *   **Project Name:** Enter `My AI Agent` (or any name you like).
    *   **Project ID:** Google will generate one automatically (e.g., `ai-agent-45123`). **Copy this ID down**—you will need it for Step 3.
    *   **Location:** Leave as `No organization` (unless you are using a workspace account).
3.  **Click Create.**

### **1.2 Enable APIs**
Once your project is created, ensure you have the project selected in the top-left dropdown, then enable these two services:
1.  **Vertex AI:** Visit the [Vertex AI Dashboard](https://console.cloud.google.com/vertex-ai) and click **Enable All Recommended APIs**.
2.  **Compute Engine:** Visit the [VM Instances page](https://console.cloud.google.com/compute/instances) and wait for the hardware dashboard to initialize.

> **Screenshot Idea:** *Show the "New Project" screen with the Project ID field highlighted.*

---

## **Step 2: Install the Google Cloud CLI (`gcloud`)**

### **2.1 Installation**
To manage your server, you need the `gcloud` tool on your computer.

| OS | Command / Link |
| :--- | :--- |
| **macOS** | `brew install --cask google-cloud-sdk` |
| **Windows** | [Download Installer](https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe) |
| **Linux** | `curl https://sdk.cloud.google.com | bash` |

### **2.2 Authentication (Linking your Account)**
Once installed, you must link the CLI to your Google account and project:
1.  **Run Initialize:** Open your terminal (or PowerShell) and type:
    ```bash
    gcloud init
    ```
2.  **Login:** It will ask to log you in. Type `Y`, and it will open your browser. Select the Google account you used in Step 1.
3.  **Select Project:** Back in the terminal, it will show a list of your projects. **Select the Project ID** you copied down in Step 1.1.

> **Screenshot Idea:** *The terminal screen showing the successful "You are now logged in as [email]" message.*

---

## **Step 3: Create the VM**

Run this command to create an optimized server. **Make sure to replace `[YOUR_PROJECT_ID]` with the ID you saved in Step 1.**

```bash
gcloud compute instances create openclaw-agent \
    --project=[YOUR_PROJECT_ID] \
    --zone=us-central1-a \
    --machine-type=e2-small \
    --provisioning-model=SPOT \
    --instance-termination-action=TERMINATE \
    --image-project=ubuntu-os-cloud \
    --image-family=ubuntu-2204-lts \
    --boot-disk-size=20GB \
    --tags=http-server,https-server
```

### **What do these parameters mean?**
*   **`--zone=us-central1-a`**: Sets the physical location of your server. `us-central1` is one of the cheapest regions in the world.
*   **`--machine-type=e2-small`**: Selects a server with 2GB of RAM. This is the minimum required to run OpenClaw smoothly.
*   **`--provisioning-model=SPOT`**: This is the "Magic" setting. It gives you the server at a **90% discount** by using Google's spare capacity.
*   **`--image-family=ubuntu-2204-lts`**: Installs the latest long-term support version of Ubuntu Linux.
*   **`--boot-disk-size=20GB`**: Provides enough storage for your agent's memory and web browsing data while staying inside the free credit limit.
*   **`--tags=http-server`**: Pre-configures the server to allow web traffic (needed for your dashboard).

> **Screenshot Idea:** *The Google Cloud Console showing the `openclaw-agent` VM with a green "Running" status.*

---

## **Step 4: Secure Private Access (Tailscale & MagicDNS)**

Tailscale creates a "private hallway" between your laptop and your server. **MagicDNS** then gives that hallway an easy-to-remember name.

1.  **On the server:** SSH in (`gcloud compute ssh openclaw-agent`) and run:
    ```bash
    curl -fsSL https://tailscale.com/install.sh | sh
    sudo tailscale up
    ```
2.  **Click the Link:** It will print a URL. Paste it into your browser to log in.
3.  **Enable MagicDNS:** Go to your [Tailscale DNS Settings](https://login.tailscale.com/admin/dns) and ensure **MagicDNS** is "Enabled."
4.  **On your phone/laptop:** Install the [Tailscale App](https://tailscale.com/download) and log in.

![Your Live OpenClaw Dashboard](openclaw_dashboard.png)
*Above: Your dashboard running securely over Tailscale MagicDNS.*

---

## **Step 5: Server Tuning**

You **must** add Swap memory to prevent build crashes on the 2GB VM.

```bash
# Add 2GB Swap Memory
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Install Core Tools
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git
sudo npm install -g pnpm pm2
```

---

## **Step 6: AI Bridge (LiteLLM)**
OpenClaw works best with Vertex AI via a **LiteLLM Proxy** bridge.

1. **Install LiteLLM:**
   ```bash
   python3.11 -m venv ~/litellm-env
   ~/litellm-env/bin/pip install 'litellm[proxy]' google-cloud-aiplatform
   ```
2. **Configure `~/litellm_config.yaml`:**
   Create this file and paste the following. It tells LiteLLM to translate OpenAI requests into Vertex AI calls.
   ```yaml
   model_list:
     - model_name: gemini-2.5-flash
       litellm_params:
         model: vertex_ai/gemini-2.5-flash
         vertex_project: [YOUR_PROJECT_ID]
         vertex_location: global
     - model_name: gemini-2.5-pro
       litellm_params:
         model: vertex_ai/gemini-2.5-pro
         vertex_project: [YOUR_PROJECT_ID]
         vertex_location: global
   ```
3. **Start with PM2:**
   ```bash
   pm2 start ~/litellm-env/bin/litellm --name litellm-proxy --interpreter none -- --config ~/litellm_config.yaml --port 4000
   ```

---

## **Step 7: Configure & Pair OpenClaw**

### **7.1 Detailed `openclaw.json`**
Open your config file: `nano ~/.openclaw/openclaw.json` and ensure it looks like this. This setup enables Tailscale and points the agent to your LiteLLM bridge.
```json
{
  "gateway": {
    "tailscale": { "mode": "serve", "resetOnExit": true },
    "bind": "loopback",
    "auth": { "allowTailscale": true }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "openai/gemini-2.5-flash" },
      "models": {
        "openai/gemini-2.5-flash": { "alias": "Gemini 2.5 Flash (Thinking)" },
        "openai/gemini-2.5-pro": { "alias": "Gemini 2.5 Pro (Genius)" }
      }
    }
  },
  "models": { "mode": "replace" },
  "plugins": {
    "entries": {
      "openai": { "enabled": true },
      "telegram": { "enabled": true }
    }
  },
  "auth": {
    "profiles": {
      "openai:default": {
        "provider": "openai",
        "mode": "api_key",
        "key": "sk-dummy",
        "baseUrl": "http://127.0.0.1:4000/v1"
      }
    }
  }
}
```

### **7.2 Whitelist your Domain**
Open your config file on the server: `nano ~/.openclaw/openclaw.json`.
Update the `allowedOrigins` to include your Tailscale name:
```json
"gateway": {
  "controlUi": {
    "allowedOrigins": ["https://openclaw-agent.tail-your-id.ts.net"]
  }
}
```
*Note: You can find your exact Tailscale URL by running `tailscale status` on the server.*

### **7.2 Pair your Device**
1.  **Open the Dashboard:** Go to your Tailscale URL (e.g., `https://openclaw-agent...`) in your browser.
2.  **Get the Request ID:** You will see a "Pairing Required" screen with a code.
3.  **Approve it:** Back in your server terminal, run:
    ```bash
    pnpm openclaw pairing approve vcontrol-ui [YOUR_REQUEST_ID]
    ```

> **Screenshot Idea:** *The "Pairing Required" screen on the OpenClaw Dashboard.*

---

## **Step 8: Automated Schedule**

To stay under the $10 credit limit, you should turn your VM off when you aren't using it (e.g., while you sleep).

Run this on your **local computer terminal** (replacing the timezone with your own):

```bash
gcloud compute resource-policies create instance-schedule daily-agent-schedule \
    --region=us-central1 \
    --vm-start-schedule="0 9 * * *" \
    --vm-stop-schedule="0 22 * * *" \
    --timezone="[YOUR_TIMEZONE]"

gcloud compute instances add-resource-policies openclaw-agent \
    --resource-policies=daily-agent-schedule --zone=us-central1-a
```

*Note: Use a valid IANA timezone string (e.g., `Asia/Kolkata`, `America/New_York`, `UTC`). You can find a full list [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).*

---

## **Monthly Cost Estimate**
| Item | Cost |
| :--- | :--- |
| **Compute (Spot)** | ~$1.40 (13h/day) |
| **Storage (20GB)** | ~$2.00 |
| **AI (Gemini 2.5 Flash)**| ~$3.00 (avg usage) |
| **Total** | **~$6.40 / Month** |

> **Screenshot Idea:** *The GCP Billing dashboard showing a very low "Current Month" cost.*


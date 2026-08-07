const dotenv = require("dotenv");
dotenv.config();

class WhatsAppService {
  constructor() {
    this.token = process.env.WHATSAPP_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.isConfigured = !!(this.token && this.phoneNumberId);

    if (!this.isConfigured) {
      console.warn("⚠️ WhatsApp Service: WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID is missing in .env. Running in MOCK mode.");
    }
  }

  /**
   * Send a template or free-text message to a WhatsApp number.
   * @param {string} to - Destination phone number with country code (e.g. "91704XXXXXXX")
   * @param {object} payload - Message content or template configurations
   */
  async sendMessage(to, payload) {
    // Normalize phone number (strip non-numeric characters)
    const cleanNumber = to.replace(/\D/g, "");

    if (!this.isConfigured) {
      console.log(`[MOCK WHATSAPP] Sending message to: ${cleanNumber}`);
      console.log(`[MOCK WHATSAPP] Payload:`, JSON.stringify(payload, null, 2));
      return { success: true, mock: true };
    }

    const url = `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`;
    
    // Build request body
    const body = {
      messaging_product: "whatsapp",
      to: cleanNumber,
      ...payload
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to send WhatsApp message");
      }

      console.log(`✅ WhatsApp message sent to ${cleanNumber}:`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ WhatsApp API Error:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Helper to send a Welcome Template to new leads
   */
  async sendWelcomeTemplate(to, leadName) {
    const payload = {
      type: "template",
      template: {
        name: "welcome_lead", // Make sure this matches your approved Meta template name
        language: {
          code: "en_US"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: leadName
              }
            ]
          }
        ]
      }
    };
    return this.sendMessage(to, payload);
  }
}

module.exports = new WhatsAppService();

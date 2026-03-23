const HOL_BASE_URL = process.env.REGISTRY_BROKER_API_URL || 'https://hol.org/registry/api/v1';
const HOL_API_KEY = process.env.REGISTRY_BROKER_API_KEY;

/**
 * Protocol Definitions for Hashgraph Online (HOL)
 * HCS-1: Content-addressed references (Hashlinks)
 * HCS-10: Conversational Agent Standard (A2A, Registration)
 * HCS-11: Verifiable Agent Profiles & Registry
 */
export enum HOLProtocol {
  HCS1 = 'hcs-1',
  HCS10 = 'hcs-10',
  HCS11 = 'hcs-11',
  HCS2 = 'hcs-2' // Base JSON Messaging
}

function isPlaceholderKey(key?: string): boolean {
  if (!key) return true;
  const placeholders = ['your_hol_api_key_here', 'placeholder', 'none', 'null', 'undefined'];
  return placeholders.includes(key.toLowerCase().trim());
}

export interface HCS11Profile {
  name: string;
  description: string;
  capabilities: string[];
  protocols: string[];
  version?: string;
  endpoints: {
    primary?: string;
    api?: string;
    rest?: string;
    [key: string]: string | undefined;
  };
  metadata?: Record<string, any>;
}

export class HOLIntegration {
  /**
   * Generates a Universal Agent Identifier (UAID) following HOL standards.
   * Format: uaid:aid:<provider>:<unique-id>
   */
  static generateUAID(agentName: string, accountId: string): string {
    const provider = 'hederon';
    const uniqueId = Buffer.from(`${agentName}-${accountId}`).toString('hex').slice(0, 16);
    return `uaid:aid:${provider}:${uniqueId}`;
  }

  /**
   * Registers an agent following the HCS-10 / HCS-11 standard.
   * Uses JSON structured messaging for on-chain transparency.
   */
  static async registerAgent(profile: HCS11Profile, accountId: string): Promise<any> {
    console.log(`[HOL] [HCS-11] Registering agent: ${profile.name}`);
    
    const uaid = this.generateUAID(profile.name, accountId);
    
    const registrationMessage = {
      p: HOLProtocol.HCS10,
      op: 'register',
      m: {
        uaid,
        profile: {
          ...profile,
          version: '1.0.0',
          protocols: [...new Set([...profile.protocols, HOLProtocol.HCS10, HOLProtocol.HCS11])]
        },
        timestamp: new Date().toISOString()
      }
    };

    if (isPlaceholderKey(HOL_API_KEY)) {
      console.warn('[HOL] Registry: Simulation Mode (HCS-11).');
      return { success: true, simulated: true, uaid, message: registrationMessage };
    }

    try {
      const response = await fetch(`${HOL_BASE_URL}/registry/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HOL_API_KEY}`,
          'x-account-id': accountId,
        },
        body: JSON.stringify(registrationMessage),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`HOL Registration (HCS-11) failed: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[HOL] HCS-11 Registration error:', error);
      throw error;
    }
  }

  /**
   * Standardized A2A Messaging following HCS-10 patterns.
   * Uses session-based routing and HCS-2 JSON payloads.
   */
  static async sendA2AMessage(targetUAID: string, text: string, senderUAID?: string): Promise<any> {
    console.log(`[HOL] [HCS-10] Sending A2A message to ${targetUAID}`);

    const chatMessage = {
      p: HOLProtocol.HCS10,
      op: 'chat',
      m: {
        text,
        sender: senderUAID || 'uaid:aid:hederon:anonymous',
        timestamp: new Date().toISOString()
      }
    };

    if (isPlaceholderKey(HOL_API_KEY)) {
      console.warn('[HOL] A2A: Simulation Mode (HCS-10).');
      return { success: true, simulated: true, payload: chatMessage };
    }

    try {
      // 1. Resolve agent session or start new session
      const sessionRes = await fetch(`${HOL_BASE_URL}/a2a/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HOL_API_KEY}`,
        },
        body: JSON.stringify({ target: targetUAID, sender: senderUAID }),
      });

      const { sessionId } = await sessionRes.json();

      // 2. Transmit HCS-10 package over HCS-2 bridge
      const msgRes = await fetch(`${HOL_BASE_URL}/a2a/transmit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HOL_API_KEY}`,
        },
        body: JSON.stringify({ sessionId, payload: chatMessage }),
      });

      const result = await msgRes.json();
      return { ...result, sessionId };
    } catch (error) {
      console.error('[HOL] A2A (HCS-10) message error:', error);
      throw error;
    }
  }

  /**
   * Content Inscription following HCS-1 Hashlink standard.
   * Creates verifiable, immutable content references on Hedera.
   */
  static async inscribeDeliverable(content: string, mimeType: string = 'text/markdown', accountId: string): Promise<any> {
    console.log('[HOL] [HCS-1] Inscribing content to Hashgraph');

    if (isPlaceholderKey(HOL_API_KEY)) {
      console.warn('[HOL] Inscription: Simulation Mode (HCS-1).');
      return { success: true, simulated: true, hrl: `hcs://1/topic:0.0.123456@hash` };
    }

    try {
      const response = await fetch(`${HOL_BASE_URL}/hcs1/inscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HOL_API_KEY}`,
          'x-account-id': accountId,
        },
        body: JSON.stringify({
          data: Buffer.from(content).toString('base64'),
          mimeType,
          metadata: { provider: 'hederon', schema: 'v1' }
        }),
      });

      if (!response.ok) {
        throw new Error(`HOL HCS-1 Inscription failed: ${response.statusText}`);
      }

      // HCS-1 returns a canonical HRL (Hashgraph Resource Locator)
      const { hrl, jobId } = await response.json();
      return { hrl, jobId, status: hrl ? 'finalized' : 'pending' };
    } catch (error) {
      console.error('[HOL] HCS-1 Inscription error:', error);
      throw error;
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      claim: {
        Row: {
          context: string
          credentialHash: string
          credentialType: string
          expirationDate: string | null
          hash: string
          isObj: boolean
          issuanceDate: string
          issuerDid: string | null
          subjectDid: string | null
          type: string
          value: string
        }
        Insert: {
          context: string
          credentialHash: string
          credentialType: string
          expirationDate?: string | null
          hash: string
          isObj: boolean
          issuanceDate: string
          issuerDid?: string | null
          subjectDid?: string | null
          type: string
          value: string
        }
        Update: {
          context?: string
          credentialHash?: string
          credentialType?: string
          expirationDate?: string | null
          hash?: string
          isObj?: boolean
          issuanceDate?: string
          issuerDid?: string | null
          subjectDid?: string | null
          type?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_3d494b79143de3d0e793883e351"
            columns: ["credentialHash"]
            isOneToOne: false
            referencedRelation: "credential"
            referencedColumns: ["hash"]
          },
          {
            foreignKeyName: "FK_d972c73d0f875c0d14c35b33baa"
            columns: ["issuerDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          },
          {
            foreignKeyName: "FK_f411679379d373424100a1c73f4"
            columns: ["subjectDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          }
        ]
      }
      credential: {
        Row: {
          context: string
          expirationDate: string | null
          hash: string
          id: string | null
          issuanceDate: string
          issuerDid: string
          raw: string
          subjectDid: string | null
          type: string
        }
        Insert: {
          context: string
          expirationDate?: string | null
          hash: string
          id?: string | null
          issuanceDate: string
          issuerDid: string
          raw: string
          subjectDid?: string | null
          type: string
        }
        Update: {
          context?: string
          expirationDate?: string | null
          hash?: string
          id?: string | null
          issuanceDate?: string
          issuerDid?: string
          raw?: string
          subjectDid?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_123d0977e0976565ee0932c0b9e"
            columns: ["issuerDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          },
          {
            foreignKeyName: "FK_b790831f44e2fa7f9661a017b0a"
            columns: ["subjectDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          }
        ]
      }
      data_subscribers: {
        Row: {
          created_at: string
          did: string | null
          endpoint: string | null
          id: number
          successful_forwarding: number | null
        }
        Insert: {
          created_at?: string
          did?: string | null
          endpoint?: string | null
          id?: number
          successful_forwarding?: number | null
        }
        Update: {
          created_at?: string
          did?: string | null
          endpoint?: string | null
          id?: number
          successful_forwarding?: number | null
        }
        Relationships: []
      }
      dwn_did_registry_2: {
        Row: {
          created_at: string
          did: string
          fingerprint: string | null
          id: number
          ip_info_jsonb: Json | null
          label: string | null
          protocol_list: Json | null
          updated_client_side_time: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          did: string
          fingerprint?: string | null
          id?: number
          ip_info_jsonb?: Json | null
          label?: string | null
          protocol_list?: Json | null
          updated_client_side_time?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          did?: string
          fingerprint?: string | null
          id?: number
          ip_info_jsonb?: Json | null
          label?: string | null
          protocol_list?: Json | null
          updated_client_side_time?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      identifier: {
        Row: {
          alias: string | null
          controllerKeyId: string | null
          did: string
          provider: string | null
          saveDate: string
          updateDate: string
        }
        Insert: {
          alias?: string | null
          controllerKeyId?: string | null
          did: string
          provider?: string | null
          saveDate: string
          updateDate: string
        }
        Update: {
          alias?: string | null
          controllerKeyId?: string | null
          did?: string
          provider?: string | null
          saveDate?: string
          updateDate?: string
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          company: string
          created_at: string
          description: string | null
          id: string
          presentation_definition: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          id?: string
          presentation_definition?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          presentation_definition?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      key: {
        Row: {
          identifierDid: string | null
          kid: string
          kms: string
          meta: string | null
          publicKeyHex: string
          type: string
        }
        Insert: {
          identifierDid?: string | null
          kid: string
          kms: string
          meta?: string | null
          publicKeyHex: string
          type: string
        }
        Update: {
          identifierDid?: string | null
          kid?: string
          kms?: string
          meta?: string | null
          publicKeyHex?: string
          type?: string
        }
        Relationships: []
      }
      message: {
        Row: {
          createdAt: string | null
          data: string | null
          expiresAt: string | null
          fromDid: string | null
          id: string
          metaData: string | null
          raw: string | null
          replyTo: string | null
          replyUrl: string | null
          saveDate: string
          threadId: string | null
          toDid: string | null
          type: string | null
          updateDate: string
        }
        Insert: {
          createdAt?: string | null
          data?: string | null
          expiresAt?: string | null
          fromDid?: string | null
          id: string
          metaData?: string | null
          raw?: string | null
          replyTo?: string | null
          replyUrl?: string | null
          saveDate: string
          threadId?: string | null
          toDid?: string | null
          type?: string | null
          updateDate: string
        }
        Update: {
          createdAt?: string | null
          data?: string | null
          expiresAt?: string | null
          fromDid?: string | null
          id?: string
          metaData?: string | null
          raw?: string | null
          replyTo?: string | null
          replyUrl?: string | null
          saveDate?: string
          threadId?: string | null
          toDid?: string | null
          type?: string | null
          updateDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_1a666b2c29bb2b68d91259f55df"
            columns: ["toDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          },
          {
            foreignKeyName: "FK_63bf73143b285c727bd046e6710"
            columns: ["fromDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          }
        ]
      }
      message_credentials_credential: {
        Row: {
          credentialHash: string
          messageId: string
        }
        Insert: {
          credentialHash: string
          messageId: string
        }
        Update: {
          credentialHash?: string
          messageId?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_1c111357e73db91a08525914b59"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_8ae8195a94b667b185d2c023e33"
            columns: ["credentialHash"]
            isOneToOne: false
            referencedRelation: "credential"
            referencedColumns: ["hash"]
          }
        ]
      }
      message_presentations_presentation: {
        Row: {
          messageId: string
          presentationHash: string
        }
        Insert: {
          messageId: string
          presentationHash: string
        }
        Update: {
          messageId?: string
          presentationHash?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_7e7094f2cd6e5ec93914ac5138f"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_a13b5cf828c669e61faf489c182"
            columns: ["presentationHash"]
            isOneToOne: false
            referencedRelation: "presentation"
            referencedColumns: ["hash"]
          }
        ]
      }
      migrations: {
        Row: {
          id: number
          name: string
          timestamp: number
        }
        Insert: {
          id?: number
          name: string
          timestamp: number
        }
        Update: {
          id?: number
          name?: string
          timestamp?: number
        }
        Relationships: []
      }
      presentation: {
        Row: {
          context: string
          expirationDate: string | null
          hash: string
          holderDid: string | null
          id: string | null
          issuanceDate: string | null
          raw: string
          type: string
        }
        Insert: {
          context: string
          expirationDate?: string | null
          hash: string
          holderDid?: string | null
          id?: string | null
          issuanceDate?: string | null
          raw: string
          type: string
        }
        Update: {
          context?: string
          expirationDate?: string | null
          hash?: string
          holderDid?: string | null
          id?: string | null
          issuanceDate?: string | null
          raw?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_a5e418449d9f527776a3bd0ca61"
            columns: ["holderDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          }
        ]
      }
      presentation_credentials_credential: {
        Row: {
          credentialHash: string
          presentationHash: string
        }
        Insert: {
          credentialHash: string
          presentationHash: string
        }
        Update: {
          credentialHash?: string
          presentationHash?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_d796bcde5e182136266b2a6b72c"
            columns: ["presentationHash"]
            isOneToOne: false
            referencedRelation: "presentation"
            referencedColumns: ["hash"]
          },
          {
            foreignKeyName: "FK_ef88f92988763fee884c37db63b"
            columns: ["credentialHash"]
            isOneToOne: false
            referencedRelation: "credential"
            referencedColumns: ["hash"]
          }
        ]
      }
      presentation_verifier_identifier: {
        Row: {
          identifierDid: string
          presentationHash: string
        }
        Insert: {
          identifierDid: string
          presentationHash: string
        }
        Update: {
          identifierDid?: string
          presentationHash?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_05b1eda0f6f5400cb173ebbc086"
            columns: ["presentationHash"]
            isOneToOne: false
            referencedRelation: "presentation"
            referencedColumns: ["hash"]
          },
          {
            foreignKeyName: "FK_3a460e48557bad5564504ddad90"
            columns: ["identifierDid"]
            isOneToOne: false
            referencedRelation: "identifier"
            referencedColumns: ["did"]
          }
        ]
      }
      "private-key": {
        Row: {
          alias: string
          privateKeyHex: string
          type: string
        }
        Insert: {
          alias: string
          privateKeyHex: string
          type: string
        }
        Update: {
          alias?: string
          privateKeyHex?: string
          type?: string
        }
        Relationships: []
      }
      public_dwn_did_registry: {
        Row: {
          created_at: string
          did: string
          id: number
          label: string | null
          protocol_list: Json | null
        }
        Insert: {
          created_at?: string
          did: string
          id?: number
          label?: string | null
          protocol_list?: Json | null
        }
        Update: {
          created_at?: string
          did?: string
          id?: number
          label?: string | null
          protocol_list?: Json | null
        }
        Relationships: []
      }
      service: {
        Row: {
          description: string | null
          id: string
          identifierDid: string | null
          serviceEndpoint: string
          type: string
        }
        Insert: {
          description?: string | null
          id: string
          identifierDid?: string | null
          serviceEndpoint: string
          type: string
        }
        Update: {
          description?: string | null
          id?: string
          identifierDid?: string | null
          serviceEndpoint?: string
          type?: string
        }
        Relationships: []
      }
      user_device_keys: {
        Row: {
          created_at: string
          device_encrypted_private_key: string
          device_encrypted_private_key_iv: string
          device_id: string
          expires_at: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          device_encrypted_private_key: string
          device_encrypted_private_key_iv: string
          device_id: string
          expires_at: string
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          device_encrypted_private_key?: string
          device_encrypted_private_key_iv?: string
          device_id?: string
          expires_at?: string
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          did: string | null
          id: string
          iv: string | null
          password_encrypted_private_key: string | null
          public_key: string | null
        }
        Insert: {
          created_at?: string
          did?: string | null
          id: string
          iv?: string | null
          password_encrypted_private_key?: string | null
          public_key?: string | null
        }
        Update: {
          created_at?: string
          did?: string | null
          id?: string
          iv?: string | null
          password_encrypted_private_key?: string | null
          public_key?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

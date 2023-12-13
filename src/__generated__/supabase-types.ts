export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  auth: {
    Tables: {
      audit_log_entries: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          ip_address: string
          payload: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Relationships: []
      }
      flow_state: {
        Row: {
          auth_code: string
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at: string | null
          id: string
          provider_access_token: string | null
          provider_refresh_token: string | null
          provider_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_code: string
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_code?: string
          authentication_method?: string
          code_challenge?: string
          code_challenge_method?: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id?: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      identities: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity_data: Json
          last_sign_in_at: string | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          identity_data: Json
          last_sign_in_at?: string | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data?: Json
          last_sign_in_at?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      instances: {
        Row: {
          created_at: string | null
          id: string
          raw_base_config: string | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      mfa_amr_claims: {
        Row: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Update: {
          authentication_method?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_amr_claims_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      mfa_challenges: {
        Row: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          verified_at: string | null
        }
        Insert: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          factor_id?: string
          id?: string
          ip_address?: unknown
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_challenges_auth_factor_id_fkey"
            columns: ["factor_id"]
            isOneToOne: false
            referencedRelation: "mfa_factors"
            referencedColumns: ["id"]
          }
        ]
      }
      mfa_factors: {
        Row: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name: string | null
          id: string
          secret: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id: string
          secret?: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          factor_type?: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id?: string
          secret?: string | null
          status?: Database["auth"]["Enums"]["factor_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_factors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          id: number
          instance_id: string | null
          parent: string | null
          revoked: boolean | null
          session_id: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      saml_providers: {
        Row: {
          attribute_mapping: Json | null
          created_at: string | null
          entity_id: string
          id: string
          metadata_url: string | null
          metadata_xml: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id: string
          id: string
          metadata_url?: string | null
          metadata_xml: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id?: string
          id?: string
          metadata_url?: string | null
          metadata_xml?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_providers_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      saml_relay_states: {
        Row: {
          created_at: string | null
          flow_state_id: string | null
          for_email: string | null
          from_ip_address: unknown | null
          id: string
          redirect_to: string | null
          request_id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          from_ip_address?: unknown | null
          id: string
          redirect_to?: string | null
          request_id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          from_ip_address?: unknown | null
          id?: string
          redirect_to?: string | null
          request_id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_relay_states_flow_state_id_fkey"
            columns: ["flow_state_id"]
            isOneToOne: false
            referencedRelation: "flow_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saml_relay_states_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      schema_migrations: {
        Row: {
          version: string
        }
        Insert: {
          version: string
        }
        Update: {
          version?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          aal: Database["auth"]["Enums"]["aal_level"] | null
          created_at: string | null
          factor_id: string | null
          id: string
          ip: unknown | null
          not_after: string | null
          refreshed_at: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id: string
          ip?: unknown | null
          not_after?: string | null
          refreshed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id?: string
          ip?: unknown | null
          not_after?: string | null
          refreshed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sso_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sso_domains_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      sso_providers: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string
          instance_id: string | null
          invited_at: string | null
          is_sso_user: boolean
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id: string
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3"
      code_challenge_method: "s256" | "plain"
      factor_status: "unverified" | "verified"
      factor_type: "totp" | "webauthn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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

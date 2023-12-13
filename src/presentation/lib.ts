import { IPresentationDefinition } from "@sphereon/pex";
import { Database } from "../__generated__/supabase-types.js";
import { stripDidPrefix } from "../credentials/lib.js";

export type PresentationDefinitionPlaceholder = {
  key: string;
  value?: string;
  validate?: (value: string) => boolean;
};
export const loadPlaceholdersIntoPresentationDefinition = (
  presentationDefinition: IPresentationDefinition,
  placeholders: PresentationDefinitionPlaceholder[],
): IPresentationDefinition => {
  let presentationDefinitionString = JSON.stringify(presentationDefinition);
  // For each placeholder in placeholders, check that the placeholder has either value or default value specified, then check that it passes validate, then do a string replace on presentationDefinitionString
  for (const placeholder of placeholders) {
    console.log(
      `loading placeholder ${placeholder.key} into presentation definition`,
    );
    if (!placeholder.value) {
      throw new Error(
        `Placeholder ${placeholder.key} is missing both value and default`,
      );
    }
    if (placeholder.validate && !placeholder.validate(placeholder.value)) {
      throw new Error(
        `Placeholder ${placeholder.key} has invalid value ${placeholder.value}`,
      );
    }
    presentationDefinitionString = presentationDefinitionString.replace(
      placeholder.key,
      placeholder.value,
    );
  }
  return JSON.parse(presentationDefinitionString);
};

export const loadUserDataPlaceholdersIntoPresentationDefinition = (
  presentationDefinition: IPresentationDefinition,
  user: Database["public"]["Tables"]["users"]["Row"],
) => {
  return loadPlaceholdersIntoPresentationDefinition(presentationDefinition, [
    {
      key: "{{user_supabase_id}}",
      value: user.id,
      validate: (value) => {
        //TODO regex check for uuid
        return true;
      },
    },
    {
      key: "{{user_wallet_pubkey}}",
      value: user.public_key || "",
      validate: (value) => {
        //TODO regex check for ethereum address
        return true;
      },
    },

    {
      key: "{{user_did_value}}",
      value: stripDidPrefix(user.did || "") || "",
      validate: (value) => {
        //TODO regex check for ethereum address
        return true;
      },
    },
    {
      key: "{{user_did}}",
      value: user.did || "",
      validate: (value) => {
        //TODO regex check for ethereum address
        return true;
      },
    },
  ]);
};

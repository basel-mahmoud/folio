import { useState } from "react";
import { View, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useSignIn, useSignUp, useSSO } from "@clerk/clerk-expo";
import { Mail, ArrowRight } from "lucide-react-native";
import { Screen, Text, Field, Button, Row } from "@/ui";
import { Logo } from "@/ui/Logo";
import { useTheme } from "@/theme";

WebBrowser.maybeCompleteAuthSession();

export function SignInScreen() {
  const t = useTheme();
  const { signIn, setActive: setActiveSignIn, isLoaded: siLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: suLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = siLoaded && suLoaded;

  async function sendCode() {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      try {
        const si = await signIn.create({ identifier: email });
        const factor = si.supportedFirstFactors?.find(
          (f) => f.strategy === "email_code",
        ) as { emailAddressId: string } | undefined;
        if (!factor) throw new Error("no_email_code");
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: factor.emailAddressId,
        });
        setFlow("signIn");
      } catch {
        await signUp.create({ emailAddress: email });
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setFlow("signUp");
      }
      setStep("code");
    } catch {
      setError("Couldn't send a code. Check the email and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      if (flow === "signIn") {
        const r = await signIn.attemptFirstFactor({ strategy: "email_code", code });
        if (r.status === "complete") await setActiveSignIn({ session: r.createdSessionId });
      } else {
        const r = await signUp.attemptEmailAddressVerification({ code });
        if (r.status === "complete") await setActiveSignUp({ session: r.createdSessionId });
      }
    } catch {
      setError("That code didn't work. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/"),
      });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch {
      setError("Google sign-in was cancelled.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, justifyContent: "center", paddingTop: 0 }}>
      <View style={{ alignItems: "center", marginBottom: t.space[10] }}>
        <Row gap={t.space[2.5]}>
          <Logo size={22} />
          <Text style={{ fontFamily: t.font.mono.bold, fontSize: 16, letterSpacing: 2.5, color: t.colors.ink }}>
            FOLIO
          </Text>
        </Row>
      </View>

      <Text variant="display" center>
        {step === "email" ? "Sign in" : "Check your email"}
      </Text>
      <Text variant="body" center style={{ marginTop: t.space[2], marginBottom: t.space[8] }}>
        {step === "email"
          ? "Build and share your portfolio. We'll email you a code — no password."
          : `We sent a 6-digit code to ${email}.`}
      </Text>

      {step === "email" ? (
        <View style={{ gap: t.space[4] }}>
          <Button
            label="Continue with Google"
            variant="secondary"
            size="lg"
            full
            loading={busy}
            onPress={google}
          />
          <Row gap={t.space[3]}>
            <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: t.colors.border }} />
            <Text variant="caption">or</Text>
            <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: t.colors.border }} />
          </Row>
          <Field
            label="Email"
            placeholder="you@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            label="Email me a code"
            size="lg"
            full
            loading={busy}
            disabled={!email.includes("@")}
            icon={<Mail size={17} color={t.colors.accentInk} strokeWidth={2} />}
            onPress={sendCode}
          />
        </View>
      ) : (
        <View style={{ gap: t.space[4] }}>
          <Field
            label="6-digit code"
            placeholder="123456"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <Button
            label="Verify & continue"
            size="lg"
            full
            loading={busy}
            disabled={code.length < 4}
            icon={<ArrowRight size={17} color={t.colors.accentInk} strokeWidth={2} />}
            onPress={verify}
          />
          <Button label="Use a different email" variant="ghost" full onPress={() => setStep("email")} />
        </View>
      )}

      {error ? (
        <Text variant="small" center style={{ color: t.colors.danger, marginTop: t.space[5] }}>
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}
